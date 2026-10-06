import Foundation

/// Las 15 categorías de gasto, con el mismo emoji que el dashboard web.
enum ExpenseCategory: String, CaseIterable, Identifiable, Codable, Sendable {
    case compras, comida, casa, transporte, salud, ropa, belleza, ocio
    case suscripciones, viajes, regalos, mascotas, formacion, facturas, otros

    var id: String { rawValue }

    var emoji: String {
        switch self {
        case .compras: "🛒"
        case .comida: "🍽️"
        case .casa: "🏠"
        case .transporte: "🚗"
        case .salud: "💊"
        case .ropa: "👗"
        case .belleza: "💅"
        case .ocio: "🎉"
        case .suscripciones: "📱"
        case .viajes: "✈️"
        case .regalos: "🎁"
        case .mascotas: "🐶"
        case .formacion: "📚"
        case .facturas: "💡"
        case .otros: "✨"
        }
    }

    var name: String {
        switch self {
        case .compras: "Compras"
        case .comida: "Comida fuera"
        case .casa: "Casa"
        case .transporte: "Transporte"
        case .salud: "Salud"
        case .ropa: "Ropa"
        case .belleza: "Belleza"
        case .ocio: "Ocio"
        case .suscripciones: "Suscripciones"
        case .viajes: "Viajes"
        case .regalos: "Regalos"
        case .mascotas: "Mascotas"
        case .formacion: "Formación"
        case .facturas: "Facturas"
        case .otros: "Otros"
        }
    }

    static func from(emoji: String) -> ExpenseCategory {
        allCases.first { $0.emoji == emoji } ?? .otros
    }
}
