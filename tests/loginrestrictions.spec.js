const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Flujo E2E 2 - Login y validación de restricciones', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('1. Intentar login sin completar campos', async () => {
        await loginPage.login('', '');
        await loginPage.validarMensajeError('Epic sadface: Username is required');
    });

    test('2. Login con usuario bloqueado', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await loginPage.validarMensajeError('Epic sadface: Sorry, this user has been locked out.');
    });

    test('3. Login con usuario válido', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.validarRedirectInventario();
    });

    test('4. Hacer logout', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.validarRedirectInventario();
        await loginPage.logout();
        await loginPage.validarRedirectLogin();
    });
});

test.describe('Escenarios Alternos - Login', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Validar credenciales incorrectas', async () => {
        await loginPage.login('usuario_no_existe', 'password123');
        await loginPage.validarMensajeError('Epic sadface: Username and password do not match any user in this service');
    });

    test('Validar acceso no autorizado a rutas internas', async ({ page }) => {
        // Intentar acceder directamente a la página de inventario
        await page.goto('https://www.saucedemo.com/inventory.html');
        
        // Validar que fuimos redirigidos al login
        await loginPage.validarRedirectLogin();
    });
});