import Foundation
import LocalAuthentication

/// Bloqueo con Face ID / Touch ID / contraseña del dispositivo.
@MainActor
final class BiometricLock: ObservableObject {
    @Published var isLocked = true

    var canAuthenticate: Bool {
        var error: NSError?
        return LAContext().canEvaluatePolicy(.deviceOwnerAuthentication, error: &error)
    }

    func authenticate(reason: String = "Desbloquea tus gastos 💖") async -> Bool {
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else { return false }
        do {
            return try await context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason)
        } catch {
            return false
        }
    }

    func unlock() async {
        // Si el dispositivo no tiene ningún método de autenticación no se puede bloquear.
        if !canAuthenticate { isLocked = false; return }
        if await authenticate() { isLocked = false }
    }

    func lock() { isLocked = true }
}
