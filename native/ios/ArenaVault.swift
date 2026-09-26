import Capacitor
import Security
import UIKit

@objc(ArenaVaultPlugin)
public class ArenaVaultPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ArenaVaultPlugin"
    public let jsName = "ArenaVault"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise)
    ]
    private var query: [String: Any] { [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: "com.berhankiyanus.tanksavasi.arena", kSecAttrAccount as String: "session"] }
    @objc func get(_ call: CAPPluginCall) {
        var q = query
        q[kSecReturnData as String] = true
        q[kSecMatchLimit as String] = kSecMatchLimitOne
        var result: CFTypeRef?
        let status = SecItemCopyMatching(q as CFDictionary, &result)
        if status == errSecItemNotFound { call.resolve(["value": ""]); return }
        guard status == errSecSuccess, let data = result as? Data, let value = String(data: data, encoding: .utf8) else { call.reject("Keychain unavailable"); return }
        call.resolve(["value": value])
    }
    @objc func set(_ call: CAPPluginCall) {
        guard let value = call.getString("value"), value.count == 64, value.allSatisfy({ $0.isHexDigit }) else { call.reject("Invalid session"); return }
        let attrs: [String: Any] = [kSecValueData as String: Data(value.utf8), kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        var status = SecItemUpdate(query as CFDictionary, attrs as CFDictionary)
        if status == errSecItemNotFound { status = SecItemAdd(query.merging(attrs) { _, new in new } as CFDictionary, nil) }
        guard status == errSecSuccess else { call.reject("Keychain write failed"); return }
        call.resolve()
    }
    @objc func remove(_ call: CAPPluginCall) {
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else { call.reject("Keychain delete failed"); return }
        call.resolve()
    }
}
@objc(FieldBridgeController)
class FieldBridgeController: CAPBridgeViewController {
    override func capacitorDidLoad() { bridge?.registerPluginInstance(ArenaVaultPlugin()) }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
}
