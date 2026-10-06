import SwiftUI
import SwiftData
import Charts

struct DashboardView: View {
    @Query(sort: \Expense.date, order: .reverse) private var expenses: [Expense]
    @Binding var year: Int
    var onAdd: () -> Void

    @AppStorage("budget", store: AppGroup.defaults) private var budget = 0.0
    @AppStorage("hideAmounts", store: AppGroup.defaults) private var hide = false

    private var stats: Stats { Stats(expenses: expenses) }

    var body: some View {
        let s = stats
        let isCurrent = year == s.currentYear
        let m = isCurrent ? s.currentMonth : 12
        let monthSpent = s.total(year: year, month: m)
        let yearTotal = s.total(year: year)
        let prev = s.total(year: year - 1)
        let delta: Double? = prev > 0 ? (yearTotal - prev) / prev * 100 : nil
        let cats = s.byCategory(year: year)
        let monthly = s.monthly(year: year)

        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: 14)], spacing: 14) {
                        KPICard(emoji: Mood(spent: monthSpent, budget: budget).emoji,
                                title: "\(Fmt.monthLong[m - 1]) \(String(year))") {
                            AmountText(value: monthSpent)
                        } footer: {
                            if budget > 0 { Text("\(Int((monthSpent / budget * 100).rounded()))% del presupuesto") } else { Text(" ") }
                        }
                        KPICard(emoji: "💰", title: "Total \(String(year))") {
                            AmountText(value: yearTotal)
                        } footer: {
                            DeltaLabel(delta: delta, previousYear: year - 1)
                        }
                        KPICard(emoji: "📊", title: "Media mensual") {
                            AmountText(value: s.monthlyAverage(year: year))
                        } footer: { Text(" ") }
                        KPICard(emoji: cats.first?.category.emoji ?? "🌸", title: "Categoría top") {
                            Text(cats.first?.category.name ?? "—")
                        } footer: {
                            if let top = cats.first { AmountText(value: top.total) } else { Text(" ") }
                        }
                    }

                    VStack(spacing: 10) {
                        SectionTitle("📅 Gasto por mes")
                        Chart {
                            ForEach(Array(monthly.enumerated()), id: \.offset) { i, v in
                                BarMark(x: .value("Mes", Fmt.monthShort[i]), y: .value("Gasto", v))
                                    .foregroundStyle(Theme.barGradient)
                                    .cornerRadius(6)
                            }
                        }
                        .chartYAxis(hide ? .hidden : .automatic)
                        .frame(height: 200)
                    }
                    .card()

                    VStack(spacing: 10) {
                        SectionTitle("🌸 Por categoría")
                        if cats.isEmpty {
                            Text("Aún no hay gastos en \(String(year)) 🌷").foregroundStyle(Theme.muted)
                        } else {
                            Chart(cats) { c in
                                SectorMark(angle: .value("Gasto", c.total), innerRadius: .ratio(0.6), angularInset: 2)
                                    .cornerRadius(5)
                                    .foregroundStyle(by: .value("Categoría", c.category.name))
                            }
                            .chartForegroundStyleScale(
                                domain: cats.map(\.category.name),
                                range: cats.indices.map { Theme.shade($0, of: cats.count) }
                            )
                            .chartLegend(.hidden)
                            .frame(height: 200)

                            ForEach(cats) { c in
                                HStack(spacing: 8) {
                                    Text("\(c.category.emoji) \(c.category.name)")
                                        .frame(width: 150, alignment: .leading)
                                    ProgressView(value: c.total, total: cats[0].total).tint(Theme.pink)
                                    AmountText(value: c.total).fontWeight(.bold)
                                        .frame(minWidth: 90, alignment: .trailing)
                                }
                                .font(.subheadline)
                            }
                        }
                    }
                    .card()
                }
                .padding(16)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("💖 Mis Gastos")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Picker("Año", selection: $year) {
                        ForEach(s.years(), id: \.self) { Text(verbatim: "\($0)").tag($0) }
                    }
                    .pickerStyle(.menu)
                }
                ToolbarItem(placement: .primaryAction) {
                    Button { hide.toggle() } label: { Text(hide ? "👀" : "🙈") }
                        .help("Ocultar importes")
                }
                ToolbarItem(placement: .primaryAction) {
                    Button(action: onAdd) { Label("Nuevo gasto", systemImage: "plus.circle.fill") }
                }
            }
        }
    }
}
