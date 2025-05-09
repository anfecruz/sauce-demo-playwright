# 🎭 Framework de Automatización Sauce Demo

## 📋 Descripción
Framework de automatización de pruebas end-to-end para el sitio web Sauce Demo utilizando Playwright, implementando Page Object Model y datos dinámicos.

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- npm (incluido con Node.js)
- Visual Studio Code (recomendado)

### Configuración
```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

## ⚡ Ejecución de Pruebas

### Todas las Pruebas
```bash
npx playwright test
```

### Archivos Específicos
```bash
# Ejecutar pruebas de login
npx playwright test tests/loginrestrictions.spec.js --headed

# Ejecutar flujo de compra E2E
npx playwright test tests/e2e.purchase.spec.js --headed
```

### Ver Reporte de Pruebas
```bash
npx playwright show-report
```

## 📁 Estructura del Proyecto
```
Reto Final/
├── fixtures/
│   └── fixtures.js         # Datos de prueba y configuraciones
├── pages/
│   ├── LoginPage.js        # Page object de login
│   └── StorePage.js        # Page object de tienda
├── tests/
│   ├── e2e.purchase.spec.js       # Pruebas de flujo de compra
│   ├── login.spec.js              # Pruebas básicas de login
│   └── loginrestrictions.spec.js  # Pruebas de restricciones
└── playwright.config.js    # Configuración de Playwright
```

## 🧪 Escenarios de Prueba

### Flujo E2E 1: Compra Completa
- Validación de login
- Agregar productos al carrito
- Proceso de checkout
- Confirmación de orden

### Flujo E2E 2: Restricciones de Login
- Validación de campos vacíos
- Intento con usuario bloqueado
- Credenciales inválidas
- Acceso no autorizado

## 📊 Reportes
- Reportes HTML generados en `playwright-report/`
- Capturas de pantalla en fallos en `test-results/`
- Archivos de traza para depuración

## 👤 Autor
- Andrés Felipe Cruz

## 🔧 Características
- Page Object Model
- Pruebas con datos dinámicos
- Pruebas cross-browser
- Capturas automáticas en fallos
- Reportes HTML

## 📝 Notas
- Las pruebas se ejecutan en modo headless por defecto
- Usar `--headed` para ver el navegador
- Timeout predeterminado de 30 segundos
- Capturas automáticas en caso de fallo
