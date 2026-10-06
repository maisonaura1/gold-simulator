#if os(macOS)
import SwiftUI
import SwiftData
import AppKit

/// Mini panel en la barra de menús de macOS con el gasto del mes.
struct MenuBarView: View {
    @Query private var expenses: [Expense]
    @Environment(\.openWindow) private var openWindow
    @AppStorage("budget", store: AppGroup.defaults) private var budget = 0.0

    var body: some View {
        let s = Stats(expenses: expenses)
        let spent = s.total(year: s.currentYear, month: s.currentMonth)
        VStack(spacing: 8) {
            Text(Mood(spent: spent, budget: budget).emoji).font(.system(size: 40))
            AmountText(value: spent).font(.title2.bold()).foregroundStyle(Theme.pink)
            Text("\(Fmt.monthLong[s.currentMonth - 1]) \(String(s.currentYear))")
                .font(.caption).foregroundStyle(.secondary)
            if budget > 0 { ProgressView(value: min(spent / budget, 1)).tint(Theme.pink) }
            Divider()
            Button("Abrir Mis Gastos 💖") {
                openWindow(id: "main")
                NSApp.activate(ignoringOtherApps: true)
            }
            Button("Nuevo gasto") {
                openWindow(id: "main")
                NSApp.activate(ignoringOtherApps: true)
                NotificationCenter.default.post(name: .addExpense, object: nil)
            }
            Button("Salir") { NSApplication.shared.terminate(nil) }
        }
        .padding(14)
        .frame(width: 220)
    }
}
#endif
