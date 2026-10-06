import SwiftUI

/// Importe con la moneda elegida; se difumina si el modo privacidad está activo.
struct AmountText: View {
    let value: Double
    @AppStorage("currency", store: AppGroup.defaults) private var currency = "EUR"
    @AppStorage("hideAmounts", store: AppGroup.defaults) private var hide = false

    var body: some View {
        Text(Money.string(value, code: currency))
            .blur(radius: hide ? 8 : 0)
            .animation(.easeInOut(duration: 0.2), value: hide)
    }
}

struct KPICard<Value: View, Footer: View>: View {
    let emoji: String
    let title: String
    @ViewBuilder var value: () -> Value
    @ViewBuilder var footer: () -> Footer

    var body: some View {
        VStack(spacing: 4) {
            Text(emoji).font(.system(size: 38))
            value()
                .font(.title2.weight(.heavy))
                .foregroundStyle(Theme.pink)
                .minimumScaleFactor(0.6)
                .lineLimit(1)
            Text(title).font(.caption).foregroundStyle(Theme.muted)
            footer().font(.caption2).foregroundStyle(Theme.muted)
        }
        .frame(maxWidth: .infinity)
        .card()
    }
}

struct DeltaLabel: View {
    let delta: Double?
    let previousYear: Int

    var body: some View {
        if let delta {
            HStack(spacing: 2) {
                Text("\(delta > 0 ? "▲" : "▼") \(Int(abs(delta).rounded()))%")
                    .fontWeight(.bold)
                    .foregroundStyle(delta > 0 ? Theme.bad : Theme.good)
                Text(verbatim: "vs \(previousYear)")
            }
        } else {
            Text(" ")
        }
    }
}

struct SectionTitle: View {
    let text: String
    init(_ text: String) { self.text = text }
    var body: some View {
        Text(text).font(.headline).foregroundStyle(Theme.ink).frame(maxWidth: .infinity, alignment: .leading)
    }
}
