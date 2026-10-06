import SwiftUI
import SwiftData

struct AddExpenseView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    var expense: Expense?

    @State private var amountText = ""
    @State private var category: ExpenseCategory = .compras
    @State private var date = Date()
    @State private var note = ""

    private var parsedAmount: Double? {
        guard let v = Double(amountText.replacingOccurrences(of: ",", with: ".")), v > 0 else { return nil }
        return v
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Categoría") {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 84), spacing: 8)], spacing: 8) {
                        ForEach(ExpenseCategory.allCases) { c in
                            Button { category = c } label: {
                                VStack(spacing: 2) {
                                    Text(c.emoji).font(.title)
                                    Text(c.name).font(.caption2).lineLimit(1)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(8)
                                .background(category == c ? Theme.pink : Theme.pinkPale,
                                            in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                                .foregroundStyle(category == c ? Color.white : Theme.ink)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.vertical, 4)
                }
                Section("Detalles") {
                    TextField("Importe 💸", text: $amountText)
                        #if os(iOS)
                        .keyboardType(.decimalPad)
                        #endif
                    DatePicker("Fecha", selection: $date, displayedComponents: .date)
                    TextField("Nota (opcional) 📝", text: $note)
                }
            }
            .formStyle(.grouped)
            .scrollContentBackground(.hidden)
            .background(Theme.background)
            .navigationTitle(expense == nil ? "Nuevo gasto 💕" : "Editar gasto")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancelar") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar", action: save).disabled(parsedAmount == nil)
                }
            }
            .onAppear(perform: load)
        }
    }

    private func load() {
        guard let e = expense else { return }
        amountText = String(e.amount)
        category = e.category
        date = e.date
        note = e.note
    }

    private func save() {
        guard let amount = parsedAmount else { return }
        let trimmed = note.trimmingCharacters(in: .whitespacesAndNewlines)
        if let e = expense {
            e.amount = amount; e.category = category; e.date = date; e.note = trimmed
        } else {
            context.insert(Expense(amount: amount, category: category, date: date, note: trimmed))
        }
        try? context.save()
        WidgetRefresher.reload()
        dismiss()
    }
}
