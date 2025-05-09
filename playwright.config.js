const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests', // Directorio donde se encuentran nuestras pruebas
    timeout: 10000, // Tiempo máximo de espera para cada prueba
    expect: {
        timeout: 8000, // Tiempo de espera para las validaciones
    },
    use: {
        headless: false, // No levantar UI
        screenshot: 'only-on-failure', // Captura pantalla solo en caso de error
        video: 'retain-on-failure', // Guarda video solo si el test falla
        trace: 'on', // Guarda trazas para depuración
    },
    projects: [
        { 
            name: 'chromium', 
            use: { browserName: 'chromium' },
            fullyParallel: true // Corre los tests en paralelo
        },
          { name: 'firefox', use: { browserName: 'firefox' }, fullyParallel: true },    
        // { name: 'webkit', use: { browserName: 'webkit' }, fullyParallel: true },
    ],
    reporter: [
        ['list'], // Muestra resultados en texto en la terminal
        ['html', { outputFolder: 'reports', open: 'never' }], // Reporte HTML en 'reports/'
        ['json', { outputFile: 'reports/report.json' }], // Reporte JSON detallado
    ],
});