const { test } = require('../fixtures/fixtures');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login E2E con Fixtures y Hooks', () => {
    let loginPage;

    // 🔹 beforeEach: Ejecutado ANTES de cada test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    // ✅ Test de login válido usando fixtures
    test('Login válido con fixture', async ({ page, sauceUser }) => {
        // Realizamos el login usando el fixture
        await loginPage.login(sauceUser.username, sauceUser.password);
        
        // Validamos que estamos en la página de productos
        await loginPage.validarRedirectInventario();
    });

    // 🔸 afterEach: Ejecutado DESPUÉS de cada test
    test.afterEach(async () => {
        // Limpiar el estado si es necesario
    });
});