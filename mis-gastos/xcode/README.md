# 💖 Mis Gastos — proyecto de Xcode (iOS + macOS + Widget)

App nativa en **SwiftUI + SwiftData + Swift Charts + WidgetKit**, multiplataforma (iOS 17 / macOS 14),
con el mismo diseño rosa y emojis que el dashboard web (`../index.html`).

## Qué incluye
- 📊 **Resumen**: gasto del mes con emoji de ánimo (😍😊😐😟😱 según tu presupuesto), total anual con ▲▼ vs año anterior, media mensual, categoría top, gráfico por mes y donut por categoría.
- 📚 **Histórico año tras año**: gráfico de totales anuales, variación %, y matriz categorías × años.
- 🧾 **Movimientos**: buscar, filtrar por mes/categoría, editar y borrar (deslizar).
- 🧩 **Widget** (pequeño, mediano y de pantalla de bloqueo en iOS) y 🍎 **icono en la barra de menús** de macOS.
- 🔒 **Privacidad**: bloqueo con Face ID / Touch ID, modo "ocultar importes" (también en el widget), datos solo en el dispositivo.
- 💾 **Copias**: exportar/importar JSON (**compatible con la copia de la web**), exportar CSV.
- ⌘N nuevo gasto en macOS · esquema `misgastos://add` (el widget lo usa) · tests unitarios · CI.

## Cómo abrirlo (en tu Mac)
```bash
brew install xcodegen
cd mis-gastos/xcode
xcodegen generate        # crea MisGastos.xcodeproj
open MisGastos.xcodeproj
```
1. En `project.yml` pon tu `DEVELOPMENT_TEAM` (o elígelo en *Signing & Capabilities* de los 2 targets).
2. **App Group**: el widget lee los mismos datos que la app mediante `group.com.misgastos.app`.
   Si cambias los bundle ids, cambia ese identificador en `project.yml` (entitlements) **y** en
   `Shared/Services/AppGroup.swift`. En macOS el App Group suele necesitar el prefijo de tu equipo (`TEAMID.group...`).
3. Elige el esquema **MisGastos** y destino *My Mac* o un iPhone → ▶︎. Para el widget: clic derecho en el escritorio → *Editar widgets* → "Mis Gastos".

## Pasar tus datos de la web a la app
En la web: ⚙️ → *Copia (JSON)*. En la app: Ajustes → *Importar copia*.

## Estructura
```
Shared/   modelo (Expense), Stats (cálculos puros), BackupService, Theme  → app + widget + tests
App/      SwiftUI: Root, Dashboard, Histórico, Movimientos, Ajustes, MenuBar, BiometricLock
Widget/   WidgetKit
Tests/    XCTest (Stats, backup, CSV)
Resources/ Assets.xcassets (icono iOS 1024 + todos los tamaños de macOS, color de acento)
```
> Nota: este proyecto se escribió sin poder compilar en Xcode (entorno Linux). Si Xcode marca algún
> error al primer build, mándame el mensaje y lo arreglo.
