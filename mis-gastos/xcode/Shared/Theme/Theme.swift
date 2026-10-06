import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

extension Color {
    init(hex: UInt32, opacity: Double = 1) {
        self.init(.sRGB,
                  red: Double((hex >> 16) & 0xFF) / 255,
                  green: Double((hex >> 8) & 0xFF) / 255,
                  blue: Double(hex & 0xFF) / 255,
                  opacity: opacity)
    }

    /// Color que se adapta al modo claro/oscuro en iOS y macOS.
    init(light: Color, dark: Color) {
        #if canImport(UIKit)
        self.init(UIColor { $0.userInterfaceStyle == .dark ? UIColor(dark) : UIColor(light) })
        #else
        self.init(NSColor(name: nil) {
            $0.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? NSColor(dark) : NSColor(light)
        })
        #endif
    }
}

enum Theme {
    static let pink = Color(hex: 0xFF6FA5)
    static let pinkSoft = Color(hex: 0xFF9EC4)
    static let pinkDeep = Color(hex: 0xE8307F)
    static let pinkPale = Color(light: Color(hex: 0xFFD1E3), dark: Color(hex: 0x5C2340))
    static let background = Color(light: Color(hex: 0xFFF0F6), dark: Color(hex: 0x2A0F1D))
    static let card = Color(light: .white, dark: Color(hex: 0x3B1629))
    static let ink = Color(light: Color(hex: 0x5A1F3A), dark: Color(hex: 0xFFE3EF))
    static let muted = Color(light: Color(hex: 0xA5688A), dark: Color(hex: 0xD79AB6))
    static let good = Color(hex: 0x2FBF8F)
    static let bad = Color(hex: 0xE5365F)

    static let barGradient = LinearGradient(colors: [pink, pinkSoft], startPoint: .bottom, endPoint: .top)
    static let widgetGradient = LinearGradient(colors: [Color(hex: 0xFF9EC4), pinkDeep], startPoint: .top, endPoint: .bottom)

    /// Paleta de rosas para gráficos con varias series.
    static func shade(_ i: Int, of n: Int) -> Color {
        let t = n > 1 ? Double(i) / Double(n - 1) : 0
        return Color(hue: i % 2 == 0 ? 0.93 : 0.97, saturation: 0.35 + 0.55 * t, brightness: 1.0 - 0.25 * t)
    }
}

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(Theme.card, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .shadow(color: Theme.pink.opacity(0.18), radius: 10, y: 4)
    }
}

extension View {
    func card() -> some View { modifier(CardStyle()) }
}
