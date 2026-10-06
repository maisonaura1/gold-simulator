import SwiftUI
import SwiftData

struct ExpensesListView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \Expense.date, order: .reverse) private var expenses: [Expense]
    @Binding var year: Int
    var onAdd: () -> Void

    @State private var search = ""
    @State private var month: Int? = nil
    @State private var category: ExpenseCategory? = nil
    @State private var editing: Expense?

    private var filtered: [Expense] {
        let cal = Calendar.current
        return expenses.filter { e in
            cal.component(.year, from: e.date) == year
                && (month == nil || cal.component(.month, from: e.date) == month)
                && (category == nil || e.category == category)
                && (search.isEmpty || e.note.localizedCaseInsensitiveContains(search)
                    || e.category.name.localizedCaseInsensitiveContains(search))
        }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Picker("Mes", selection: $month) {
                        Text("Todo el año").tag(Int?.none)
                        ForEach(1...12, id: \.self) { Text(Fmt.monthLong[$0 - 1]).tag(Int?.some($0)) }
                    }
                    Picker("Categoría", selection: $category) {
                        Text("Todas").tag(ExpenseCategory?.none)
                        ForEach(ExpenseCategory.allCases) { Text("\($0.emoji) \($0.name)").tag(ExpenseCategory?.some($0)) }
                    }
                }
                Section {
                    if filtered.isEmpty {
                        Text("Sin movimientos 🌷").foregroundStyle(Theme.muted)
                    }
                    ForEach(filtered) { e in
                        Button { editing = e } label: {
                            HStack(spacing: 12) {
                                Text(e.category.emoji).font(.title)
                                VStack(alignment: .leading, spacing: 2) {
                                    HStack {
                                        AmountText(value: e.amount).fontWeight(.bold)
                                        Text(e.category.name).font(.caption).foregroundStyle(Theme.muted)
                                    }
                                    Text(e.date.formatted(date: .abbreviated, time: .omitted)
                                         + (e.note.isEmpty ? "" : " · \(e.note)"))
                                        .font(.caption).foregroundStyle(Theme.muted)
                                }
                                Spacer()
                            }
                        }
                        .buttonStyle(.plain)
                    }
                    .onDelete(perform: delete)
                }
            }
            .scrollContentBackground(.hidden)
            .background(Theme.background.ignoresSafeArea())
            .searchable(text: $search, prompt: "Buscar nota o categoría")
            .navigationTitle("🧾 Movimientos \(String(year))")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: onAdd) { Label("Nuevo gasto", systemImage: "plus.circle.fill") }
                }
            }
            .sheet(item: $editing) { e in
                AddExpenseView(expense: e)
                    #if os(macOS)
                    .frame(minWidth: 420, minHeight: 560)
                    #endif
            }
        }
    }

    private func delete(at offsets: IndexSet) {
        let list = filtered
        for i in offsets { context.delete(list[i]) }
        try? context.save()
        WidgetRefresher.reload()
    }
}
