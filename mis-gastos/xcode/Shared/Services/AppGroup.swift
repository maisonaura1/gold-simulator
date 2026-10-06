import Foundation
import SwiftData
import WidgetKit

/// Contenedor compartido entre la app y el widget.
/// Cambia el identificador si cambias el bundle id (ver README).
enum AppGroup {
    static let id = "group.com.misgastos.app"
    static let defaults = UserDefaults(suiteName: id) ?? .standard
}

enum SharedStore {
    static let schema = Schema([Expense.self])

    static func makeContainer(inMemory: Bool = false) throws -> ModelContainer {
        let config: ModelConfiguration
        if inMemory {
            config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true, cloudKitDatabase: .none)
        } else {
            config = ModelConfiguration(schema: schema, groupContainer: .identifier(AppGroup.id), cloudKitDatabase: .none)
        }
        return try ModelContainer(for: schema, configurations: [config])
    }
}

enum WidgetRefresher {
    static func reload() { WidgetCenter.shared.reloadAllTimelines() }
}

enum Money {
    static var currentCode: String { AppGroup.defaults.string(forKey: "currency") ?? "EUR" }

    static func string(_ value: Double, code: String = Money.currentCode) -> String {
        value.formatted(.currency(code: code))
    }
}
