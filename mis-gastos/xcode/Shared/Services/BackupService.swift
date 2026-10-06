import Foundation

/// Formato de copia compatible con el dashboard web (`mis-gastos/index.html`):
/// `{ "exp": [{ id, amount, cat (emoji), date "yyyy-MM-dd", note }], "budget": n, "cur": "€" }`
struct WebBackup: Codable {
    struct Item: Codable {
        var id: Int
        var amount: Double
        var cat: String
        var date: String
        var note: String

        init(id: Int, amount: Double, cat: String, date: String, note: String) {
            self.id = id; self.amount = amount; self.cat = cat; self.date = date; self.note = note
        }

        init(from decoder: Decoder) throws {
            let c = try decoder.container(keyedBy: CodingKeys.self)
            id = (try? c.decode(Int.self, forKey: .id)) ?? 0
            amount = try c.decode(Double.self, forKey: .amount)
            cat = (try? c.decode(String.self, forKey: .cat)) ?? "✨"
            date = try c.decode(String.self, forKey: .date)
            note = (try? c.decode(String.self, forKey: .note)) ?? ""
        }
    }

    var exp: [Item]
    var budget: Double?
    var cur: String?
}

struct ImportedExpense {
    let amount: Double
    let category: ExpenseCategory
    let date: Date
    let note: String
}

enum BackupService {
    private static let symbolToCode = ["€": "EUR", "$": "USD", "£": "GBP"]

    private static func formatter() -> DateFormatter {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f
    }

    static func export(expenses: [Expense], budget: Double, currencyCode: String) throws -> Data {
        let f = formatter()
        let symbol = symbolToCode.first { $0.value == currencyCode }?.key ?? currencyCode
        let items = expenses.enumerated().map { i, e in
            WebBackup.Item(id: Int(e.date.timeIntervalSince1970 * 1000) + i, amount: e.amount,
                           cat: e.category.emoji, date: f.string(from: e.date), note: e.note)
        }
        let enc = JSONEncoder()
        enc.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try enc.encode(WebBackup(exp: items, budget: budget, cur: symbol))
    }

    static func decode(_ data: Data) throws -> (items: [ImportedExpense], budget: Double?, currencyCode: String?) {
        let backup = try JSONDecoder().decode(WebBackup.self, from: data)
        let f = formatter()
        let items = backup.exp.compactMap { i -> ImportedExpense? in
            guard let d = f.date(from: i.date), i.amount > 0 else { return nil }
            return ImportedExpense(amount: i.amount, category: .from(emoji: i.cat), date: d, note: i.note)
        }
        let code = backup.cur.map { symbolToCode[$0] ?? $0 }
        return (items, backup.budget, code)
    }

    static func csv(expenses: [Expense]) -> Data {
        let f = formatter()
        var out = "fecha,categoria,importe,nota\n"
        for e in expenses.sorted(by: { $0.date < $1.date }) {
            let note = "\"" + e.note.replacingOccurrences(of: "\"", with: "\"\"") + "\""
            out += "\(f.string(from: e.date)),\(e.category.name),\(e.amount),\(note)\n"
        }
        return Data(out.utf8)
    }
}
