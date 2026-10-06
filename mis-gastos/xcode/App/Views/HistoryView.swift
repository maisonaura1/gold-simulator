import SwiftUI
import SwiftData
import Charts

/// Histórico año tras año: totales, variación y categorías por año.
struct HistoryView: View {
    @Query private var expenses: [Expense]

    var body: some View {
        let s = Stats(expenses: expenses)
        let totals = s.yearTotals()
        let years = totals.map(\.year)

        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    VStack(spacing: 10) {
                        SectionTitle("📚 Año tras año")
                        Chart(totals) { t in
                            BarMark(x: .value("Año", String(t.year)), y: .value("Total", t.total))
                                .foregroundStyle(Theme.barGradient)
                                .cornerRadius(8)
                        }
                        .frame(height: 180)
                    }
                    .card()

                    VStack(spacing: 8) {
                        SectionTitle("📈 Resumen anual")
                        ForEach(totals.reversed()) { t in
                            HStack {
                                Text(verbatim: "\(t.year)").fontWeight(.heavy).frame(width: 56, alignment: .leading)
                                VStack(alignment: .leading, spacing: 2) {
                                    AmountText(value: t.total).fontWeight(.bold)
                                    HStack(spacing: 4) {
                                        Text("Media/mes")
                                        AmountText(value: t.monthlyAverage)
                                    }
                                    .font(.caption).foregroundStyle(Theme.muted)
                                }
                                Spacer()
                                VStack(alignment: .trailing, spacing: 2) {
                                    if let d = t.delta {
                                        Text("\(d > 0 ? "▲" : "▼") \(Int(abs(d).rounded()))%")
                                            .fontWeight(.bold)
                                            .foregroundStyle(d > 0 ? Theme.bad : Theme.good)
                                    }
                                    if let c = t.topCategory { Text("\(c.emoji) \(c.name)").font(.caption).foregroundStyle(Theme.muted) }
                                }
                            }
                            Divider()
                        }
                    }
                    .card()

                    VStack(spacing: 8) {
                        SectionTitle("🗂️ Categorías por año")
                        ScrollView(.horizontal, showsIndicators: false) {
                            Grid(alignment: .trailing, horizontalSpacing: 18, verticalSpacing: 8) {
                                GridRow {
                                    Text("")
                                    ForEach(years, id: \.self) { Text(verbatim: "\($0)").fontWeight(.bold) }
                                }
                                ForEach(ExpenseCategory.allCases) { c in
                                    GridRow {
                                        Text("\(c.emoji) \(c.name)").gridColumnAlignment(.leading)
                                        ForEach(years, id: \.self) { y in
                                            let v = s.total(year: y, category: c)
                                            if v > 0 { AmountText(value: v) } else { Text("·").foregroundStyle(Theme.muted) }
                                        }
                                    }
                                }
                            }
                            .font(.subheadline)
                        }
                    }
                    .card()
                }
                .padding(16)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("📚 Histórico")
        }
    }
}
