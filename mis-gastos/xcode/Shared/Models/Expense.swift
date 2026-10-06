import Foundation
import SwiftData

/// Un gasto. Todas las propiedades tienen valor por defecto para que el modelo
/// sea compatible con CloudKit si algún día se activa la sincronización con iCloud.
@Model
final class Expense {
    var id: UUID = UUID()
    var amount: Double = 0
    var categoryRaw: String = ExpenseCategory.otros.rawValue
    var date: Date = Date()
    var note: String = ""

    init(amount: Double, category: ExpenseCategory, date: Date = Date(), note: String = "") {
        self.amount = amount
        self.categoryRaw = category.rawValue
        self.date = date
        self.note = note
    }

    var category: ExpenseCategory {
        get { ExpenseCategory(rawValue: categoryRaw) ?? .otros }
        set { categoryRaw = newValue.rawValue }
    }
}
