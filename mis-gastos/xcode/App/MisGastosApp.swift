import SwiftUI
import SwiftData

extension Notification.Name {
    static let addExpense = Notification.Name("misgastos.addExpense")
}

@main
struct MisGastosApp: App {
    private let container: ModelContainer

    init() {
        do {
            container = try SharedStore.makeContainer()
        } catch {
            fatalError("No se pudo abrir la base de datos: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup(id: "main") {
            RootView()
                .tint(Theme.pink)
        }
        .modelContainer(container)
        #if os(macOS)
        .defaultSize(width: 1100, height: 780)
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Nuevo gasto 💕") { NotificationCenter.default.post(name: .addExpense, object: nil) }
                    .keyboardShortcut("n")
            }
        }
        #endif

        #if os(macOS)
        MenuBarExtra("Mis Gastos", systemImage: "heart.fill") {
            MenuBarView()
                .modelContainer(container)
        }
        .menuBarExtraStyle(.window)
        #endif
    }
}
