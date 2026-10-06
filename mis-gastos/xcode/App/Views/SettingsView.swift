import SwiftUI
import SwiftData
import UniformTypeIdentifiers

struct DataDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.json, .commaSeparatedText] }
    var data: Data

    init(data: Data) { self.data = data }
    init(configuration: ReadConfiguration) throws { data = configuration.file.regularFileContents ?? Data() }
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper { FileWrapper(regularFileWithContents: data) }
}

struct SettingsView: View {
    @Environment(\.modelContext) private var context
    @EnvironmentObject private var lock: BiometricLock
    @Query private var expenses: [Expense]

    @AppStorage("budget", store: AppGroup.defaults) private var budget = 0.0
    @AppStorage("currency", store: AppGroup.defaults) private var currency = "EUR"
    @AppStorage("lockEnabled", store: AppGroup.defaults) private var lockEnabled = false
    @AppStorage("hideAmounts", store: AppGroup.defaults) private var hide = false

    @State private var exportJSON = false
    @State private var exportCSV = false
    @State private var showImport = false
    @State private var pendingImport: Data?
    @State private var confirmImport = false
    @State private var confirmWipe = false
    @State private var message: String?

    private static let currencies = ["EUR", "USD", "GBP", "MXN", "ARS", "COP", "CLP", "PEN"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Presupuesto 🎯") {
                    TextField("Presupuesto mensual", value: $budget, format: .number)
                        #if os(iOS)
                        .keyboardType(.decimalPad)
                        #endif
                    Picker("Moneda", selection: $currency) {
                        ForEach(Self.currencies, id: \.self) { Text($0).tag($0) }
                    }
                }
                Section {
                    Toggle("Bloquear con Face ID / Touch ID 🔒", isOn: Binding(
                        get: { lockEnabled },
                        set: { on in
                            if on {
                                Task {
                                    if await lock.authenticate(reason: "Activa el bloqueo de Mis Gastos") {
                                        lockEnabled = true
                                        lock.isLocked = false
                                    } else {
                                        message = "No se pudo activar el bloqueo. Configura un código en tu dispositivo."
                                    }
                                }
                            } else {
                                lockEnabled = false
                            }
                        }))
                    Toggle("Ocultar importes 🙈", isOn: $hide)
                } header: { Text("Privacidad") } footer: {
                    Text("Tus datos se guardan solo en este dispositivo. Nada se envía a ningún servidor.")
                }
                Section("Copia de seguridad") {
                    Button("⬇️ Exportar copia (JSON)") { exportJSON = true }
                    Button("⬇️ Exportar CSV") { exportCSV = true }
                    Button("⬆️ Importar copia (JSON, también la de la web)") { showImport = true }
                    Button("🗑️ Borrar todo", role: .destructive) { confirmWipe = true }
                }
            }
            .formStyle(.grouped)
            .scrollContentBackground(.hidden)
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("⚙️ Ajustes")
            .onChange(of: budget) { _, _ in WidgetRefresher.reload() }
            .onChange(of: currency) { _, _ in WidgetRefresher.reload() }
            .onChange(of: hide) { _, _ in WidgetRefresher.reload() }
            .fileExporter(isPresented: $exportJSON,
                          document: DataDocument(data: (try? BackupService.export(expenses: expenses, budget: budget, currencyCode: currency)) ?? Data()),
                          contentType: .json, defaultFilename: "mis-gastos") { _ in }
            .fileExporter(isPresented: $exportCSV,
                          document: DataDocument(data: BackupService.csv(expenses: expenses)),
                          contentType: .commaSeparatedText, defaultFilename: "mis-gastos") { _ in }
            .fileImporter(isPresented: $showImport, allowedContentTypes: [.json]) { result in
                guard case .success(let url) = result else { return }
                let access = url.startAccessingSecurityScopedResource()
                defer { if access { url.stopAccessingSecurityScopedResource() } }
                if let data = try? Data(contentsOf: url) {
                    pendingImport = data
                    confirmImport = true
                } else {
                    message = "No se pudo leer el archivo."
                }
            }
            .confirmationDialog("Esto reemplaza tus datos actuales", isPresented: $confirmImport, titleVisibility: .visible) {
                Button("Reemplazar", role: .destructive, action: applyImport)
                Button("Cancelar", role: .cancel) { pendingImport = nil }
            }
            .confirmationDialog("¿Borrar TODOS los gastos? No se puede deshacer 😢", isPresented: $confirmWipe, titleVisibility: .visible) {
                Button("Borrar todo", role: .destructive) {
                    try? context.delete(model: Expense.self)
                    try? context.save()
                    WidgetRefresher.reload()
                }
                Button("Cancelar", role: .cancel) {}
            }
            .alert("Mis Gastos", isPresented: Binding(get: { message != nil }, set: { if !$0 { message = nil } })) {
                Button("OK") {}
            } message: { Text(message ?? "") }
        }
    }

    private func applyImport() {
        guard let data = pendingImport else { return }
        pendingImport = nil
        do {
            let result = try BackupService.decode(data)
            try context.delete(model: Expense.self)
            for i in result.items {
                context.insert(Expense(amount: i.amount, category: i.category, date: i.date, note: i.note))
            }
            if let b = result.budget { budget = b }
            if let c = result.currencyCode, Self.currencies.contains(c) { currency = c }
            try context.save()
            WidgetRefresher.reload()
            message = "Importados \(result.items.count) gastos 💕"
        } catch {
            message = "Archivo no válido."
        }
    }
}
