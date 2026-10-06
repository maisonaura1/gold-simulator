import XCTest

final class StatsTests: XCTestCase {
    private var cal: Calendar = {
        var c = Calendar(identifier: .gregorian)
        c.timeZone = TimeZone(identifier: "UTC")!
        return c
    }()

    private func date(_ y: Int, _ m: Int, _ d: Int) -> Date {
        cal.date(from: DateComponents(year: y, month: m, day: d, hour: 12))!
    }

    private func stats(_ e: [Expense]) -> Stats {
        Stats(expenses: e, calendar: cal, now: date(2026, 10, 6))
    }

    func testMoodThresholds() {
        XCTAssertEqual(Mood(spent: 10, budget: 0), .noBudget)
        XCTAssertEqual(Mood(spent: 50, budget: 100), .love)
        XCTAssertEqual(Mood(spent: 80, budget: 100), .happy)
        XCTAssertEqual(Mood(spent: 100, budget: 100), .neutral)
        XCTAssertEqual(Mood(spent: 120, budget: 100), .worried)
        XCTAssertEqual(Mood(spent: 121, budget: 100), .panic)
    }

    func testMonthlyAndTotals() {
        let s = stats([
            Expense(amount: 10, category: .compras, date: date(2026, 1, 5)),
            Expense(amount: 20, category: .ocio, date: date(2026, 1, 20)),
            Expense(amount: 5, category: .compras, date: date(2026, 3, 1)),
            Expense(amount: 99, category: .compras, date: date(2025, 3, 1)),
        ])
        XCTAssertEqual(s.monthly(year: 2026)[0], 30)
        XCTAssertEqual(s.monthly(year: 2026)[2], 5)
        XCTAssertEqual(s.total(year: 2026), 35)
        XCTAssertEqual(s.total(year: 2026, month: 1), 30)
        XCTAssertEqual(s.years(), [2026, 2025])
    }

    func testByCategorySortedDescending() {
        let s = stats([
            Expense(amount: 10, category: .compras, date: date(2026, 1, 5)),
            Expense(amount: 50, category: .ocio, date: date(2026, 2, 5)),
            Expense(amount: 15, category: .compras, date: date(2026, 3, 5)),
        ])
        let c = s.byCategory(year: 2026)
        XCTAssertEqual(c.map(\.category), [.ocio, .compras])
        XCTAssertEqual(c[1].total, 25)
    }

    func testYearTotalsDeltaAndAverage() {
        let s = stats([
            Expense(amount: 100, category: .casa, date: date(2025, 6, 1)),
            Expense(amount: 150, category: .casa, date: date(2026, 6, 1)),
        ])
        let t = s.yearTotals()
        XCTAssertEqual(t.map(\.year), [2025, 2026])
        XCTAssertNil(t[0].delta)
        XCTAssertEqual(t[1].delta ?? 0, 50, accuracy: 0.001)
        XCTAssertEqual(t[0].monthlyAverage, 100)          // un solo mes con gasto
        XCTAssertEqual(t[1].monthlyAverage, 15, accuracy: 0.001) // 150 / 10 meses (octubre)
    }

    func testBackupRoundTripAndWebImport() throws {
        let original = [
            Expense(amount: 12.5, category: .viajes, date: date(2026, 4, 2), note: "tren \"ave\""),
            Expense(amount: 3, category: .mascotas, date: date(2026, 4, 3)),
        ]
        let data = try BackupService.export(expenses: original, budget: 800, currencyCode: "EUR")
        let decoded = try BackupService.decode(data)
        XCTAssertEqual(decoded.items.count, 2)
        XCTAssertEqual(decoded.budget, 800)
        XCTAssertEqual(decoded.currencyCode, "EUR")
        XCTAssertEqual(Set(decoded.items.map(\.category)), [.viajes, .mascotas])

        let web = #"{"exp":[{"id":1,"amount":9.9,"cat":"🛒","date":"2025-03-10","note":"x"},{"id":2,"amount":5,"cat":"?","date":"2025-03-11"}],"budget":0,"cur":"$"}"#
        let imported = try BackupService.decode(Data(web.utf8))
        XCTAssertEqual(imported.items.count, 2)
        XCTAssertEqual(imported.items[0].category, .compras)
        XCTAssertEqual(imported.items[1].category, .otros)
        XCTAssertEqual(imported.currencyCode, "USD")
    }

    func testCSVEscapesQuotes() {
        let csv = String(decoding: BackupService.csv(expenses: [
            Expense(amount: 1, category: .otros, date: date(2026, 1, 1), note: "di \"hola\"")
        ]), as: UTF8.self)
        XCTAssertTrue(csv.contains("\"di \"\"hola\"\"\""))
    }
}
