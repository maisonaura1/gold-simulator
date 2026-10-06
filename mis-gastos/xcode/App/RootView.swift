import SwiftUI
import SwiftData

struct RootView: View {
    @StateObject private var lock = BiometricLock()
    @Environment(\.scenePhase) private var scenePhase
    @AppStorage("lockEnabled", store: AppGroup.defaults) private var lockEnabled = false
    @State private var showAdd = false
    @State private var year = Calendar.current.component(.year, from: Date())

    var body: some View {
        ZStack {
            MainTabs(year: $year, showAdd: $showAdd)
                .blur(radius: lockEnabled && lock.isLocked ? 30 : 0)
            if lockEnabled && lock.isLocked {
                LockView(lock: lock)
            }
        }
        .environmentObject(lock)
        .sheet(isPresented: $showAdd) {
            AddExpenseView()
                #if os(macOS)
                .frame(minWidth: 420, minHeight: 560)
                #endif
        }
        .onOpenURL { url in
            if url.host == "add" { showAdd = true }
        }
        .onReceive(NotificationCenter.default.publisher(for: .addExpense)) { _ in showAdd = true }
        .onChange(of: scenePhase) { _, phase in
            guard lockEnabled else { return }
            if phase == .background { lock.lock() }
            if phase == .active && lock.isLocked { Task { await lock.unlock() } }
        }
        .task {
            if lockEnabled { await lock.unlock() }
        }
    }
}

struct LockView: View {
    @ObservedObject var lock: BiometricLock

    var body: some View {
        VStack(spacing: 14) {
            Text("🔒💖").font(.system(size: 72))
            Text("Tu espacio privado").font(.title2.bold()).foregroundStyle(Theme.ink)
            Button("Desbloquear") { Task { await lock.unlock() } }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.background.opacity(0.92))
    }
}

struct MainTabs: View {
    @Binding var year: Int
    @Binding var showAdd: Bool

    var body: some View {
        TabView {
            DashboardView(year: $year, onAdd: { showAdd = true })
                .tabItem { Label("Resumen", systemImage: "heart.fill") }
            ExpensesListView(year: $year, onAdd: { showAdd = true })
                .tabItem { Label("Movimientos", systemImage: "list.bullet.rectangle") }
            HistoryView()
                .tabItem { Label("Histórico", systemImage: "chart.bar.xaxis") }
            SettingsView()
                .tabItem { Label("Ajustes", systemImage: "gearshape.fill") }
        }
    }
}
