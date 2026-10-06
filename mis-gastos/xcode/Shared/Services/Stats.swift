import Foundation

enum Mood: String {
    case noBudget = "💗", love = "😍", happy = "😊", neutral = "😐", worried = "😟", panic = "😱"

    /// Emoji según el porcentaje del presupuesto mensual gastado.
    init(spent: Double, budget: Double) {
        guard budget > 0 else { self = .noBudget; return }
        switch spent / budget {
        case ...0.5: self = .love
        case ...0.8: self = .happy
        case ...1.0: self = .neutral
        case ...1.2: self = .worried
        default: self = .panic
        }
    }

    var emoji: String { rawValue }
}

struct CategoryTotal: Identifiable {
    var id: ExpenseCategory { category }
    let category: ExpenseCategory
    let total: Double
}

struct YearTotal: Identifiable {
    var id: Int { year }
    let year: Int
    let total: Double
    let monthlyAverage: Double
    /// Variación en % respecto al año anterior (nil si no hay datos previos).
    let delta: Double?
    let topCategory: ExpenseCategory?
}

/// Cálculos puros sobre una lista de gastos (fáciles de testear).
struct Stats {
    let expenses: [Expense]
    var calendar: Calendar = .current
    var now: Date = Date()

    private func year(_ e: Expense) -> Int { calendar.component(.year, from: e.date) }
    private func month(_ e: Expense) -> Int { calendar.component(.month, from: e.date) }

    var currentYear: Int { calendar.component(.year, from: now) }
    var currentMonth: Int { calendar.component(.month, from: now) }

    /// Años con datos + el año actual, del más reciente al más antiguo.
    func years() -> [Int] {
        Array(Set(expenses.map(year)).union([currentYear])).sorted(by: >)
    }

    func total(year y: Int, month m: Int? = nil) -> Double {
        expenses.filter { year($0) == y && (m == nil || month($0) == m) }.reduce(0) { $0 + $1.amount }
    }

    /// 12 valores, enero…diciembre.
    func monthly(year y: Int) -> [Double] {
        var out = Array(repeating: 0.0, count: 12)
        for e in expenses where year(e) == y { out[month(e) - 1] += e.amount }
        return out
    }

    func byCategory(year y: Int) -> [CategoryTotal] {
        var acc: [ExpenseCategory: Double] = [:]
        for e in expenses where year(e) == y { acc[e.category, default: 0] += e.amount }
        return acc.map { CategoryTotal(category: $0.key, total: $0.value) }.sorted { $0.total > $1.total }
    }

    /// Meses sobre los que promediar: los transcurridos si es el año actual, si no los meses con gasto.
    func monthsDivisor(year y: Int) -> Int {
        if y == currentYear { return currentMonth }
        return max(1, Set(expenses.filter { year($0) == y }.map(month)).count)
    }

    func monthlyAverage(year y: Int) -> Double { total(year: y) / Double(monthsDivisor(year: y)) }

    func yearTotals() -> [YearTotal] {
        years().sorted().map { y in
            let t = total(year: y)
            let prev = total(year: y - 1)
            return YearTotal(
                year: y, total: t, monthlyAverage: monthlyAverage(year: y),
                delta: prev > 0 ? (t - prev) / prev * 100 : nil,
                topCategory: byCategory(year: y).first?.category
            )
        }
    }

    func total(year y: Int, category c: ExpenseCategory) -> Double {
        expenses.filter { year($0) == y && $0.category == c }.reduce(0) { $0 + $1.amount }
    }
}

enum Fmt {
    static let monthShort: [String] = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "es_ES")
        return f.shortMonthSymbols.map { $0.replacingOccurrences(of: ".", with: "").capitalized }
    }()

    static let monthLong: [String] = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "es_ES")
        return f.monthSymbols.map { $0.capitalized }
    }()
}
