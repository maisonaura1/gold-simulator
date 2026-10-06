import WidgetKit
import SwiftUI
import SwiftData

struct SpendEntry: TimelineEntry {
    let date: Date
    let spent: Double
    let budget: Double
    let currency: String
    let hidden: Bool
    let top: [CategoryTotal]

    var mood: Mood { Mood(spent: spent, budget: budget) }
    var progress: Double { budget > 0 ? spent / budget : 0 }
    var monthName: String { Fmt.monthLong[Calendar.current.component(.month, from: date) - 1] }
    var amountText: String { hidden ? "•••••" : Money.string(spent, code: currency) }

    static let sample = SpendEntry(
        date: Date(), spent: 428.5, budget: 800, currency: "EUR", hidden: false,
        top: [CategoryTotal(category: .compras, total: 160), CategoryTotal(category: .comida, total: 120),
              CategoryTotal(category: .ocio, total: 80)]
    )
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SpendEntry { .sample }

    func getSnapshot(in context: Context, completion: @escaping (SpendEntry) -> Void) {
        completion(context.isPreview ? .sample : load())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SpendEntry>) -> Void) {
        let next = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date().addingTimeInterval(1800)
        completion(Timeline(entries: [load()], policy: .after(next)))
    }

    private func load() -> SpendEntry {
        let defaults = AppGroup.defaults
        let budget = defaults.double(forKey: "budget")
        let currency = defaults.string(forKey: "currency") ?? "EUR"
        let hidden = defaults.bool(forKey: "hideAmounts")
        let now = Date()
        let cal = Calendar.current
        guard let start = cal.date(from: cal.dateComponents([.year, .month], from: now)),
              let end = cal.date(byAdding: .month, value: 1, to: start),
              let container = try? SharedStore.makeContainer() else {
            return SpendEntry(date: now, spent: 0, budget: budget, currency: currency, hidden: hidden, top: [])
        }
        let context = ModelContext(container)
        let descriptor = FetchDescriptor<Expense>(predicate: #Predicate { $0.date >= start && $0.date < end })
        let month = (try? context.fetch(descriptor)) ?? []
        let stats = Stats(expenses: month, calendar: cal, now: now)
        let year = cal.component(.year, from: now)
        return SpendEntry(
            date: now,
            spent: stats.total(year: year, month: cal.component(.month, from: now)),
            budget: budget, currency: currency, hidden: hidden,
            top: Array(stats.byCategory(year: year).prefix(3))
        )
    }
}

struct MisGastosWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: SpendEntry

    var body: some View {
        Group {
            switch family {
            case .systemMedium: medium
            #if os(iOS)
            case .accessoryCircular: circular
            case .accessoryRectangular: rectangular
            #endif
            default: small
            }
        }
        .widgetURL(URL(string: "misgastos://add"))
        .containerBackground(Theme.widgetGradient, for: .widget)
    }

    private var small: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(entry.mood.emoji).font(.system(size: 34))
                Spacer()
                Text(entry.monthName).font(.caption2.bold())
            }
            Spacer(minLength: 0)
            Text(entry.amountText).font(.title3.weight(.heavy)).minimumScaleFactor(0.6).lineLimit(1)
            if entry.budget > 0 {
                ProgressView(value: min(entry.progress, 1)).tint(.white)
                Text("\(Int((entry.progress * 100).rounded()))% del presupuesto").font(.caption2)
            } else {
                Text("este mes").font(.caption2)
            }
        }
        .foregroundStyle(.white)
    }

    private var medium: some View {
        HStack(alignment: .top, spacing: 16) {
            small
            VStack(alignment: .leading, spacing: 6) {
                Text("🌸 Top categorías").font(.caption.bold())
                if entry.top.isEmpty {
                    Text("Aún sin gastos 🌷").font(.caption)
                }
                ForEach(entry.top) { c in
                    HStack {
                        Text("\(c.category.emoji) \(c.category.name)").font(.caption).lineLimit(1)
                        Spacer()
                        Text(entry.hidden ? "•••" : Money.string(c.total, code: entry.currency))
                            .font(.caption.bold())
                    }
                }
                Spacer(minLength: 0)
                Text("＋ Toca para añadir un gasto").font(.caption2)
            }
            .foregroundStyle(.white)
        }
    }

    #if os(iOS)
    private var circular: some View {
        Gauge(value: min(entry.progress, 1)) {
            Text("💖")
        } currentValueLabel: {
            Text(entry.mood.emoji)
        }
        .gaugeStyle(.accessoryCircular)
    }

    private var rectangular: some View {
        VStack(alignment: .leading) {
            Text("\(entry.mood.emoji) \(entry.monthName)").font(.headline)
            Text(entry.amountText).font(.title3.bold())
            if entry.budget > 0 { ProgressView(value: min(entry.progress, 1)) }
        }
    }
    #endif
}

struct MisGastosWidget: Widget {
    let kind = "MisGastosWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MisGastosWidgetView(entry: entry)
        }
        .configurationDisplayName("Gasto del mes 💖")
        .description("Cuánto llevas gastado este mes y cómo vas con tu presupuesto.")
        #if os(iOS)
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
        #else
        .supportedFamilies([.systemSmall, .systemMedium])
        #endif
    }
}

@main
struct MisGastosWidgetBundle: WidgetBundle {
    var body: some Widget { MisGastosWidget() }
}
