const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { StorePage } = require('../pages/StorePage');

test.describe('Flujo E2E - Compra Completa', () => {
    let loginPage;
    let storePage;

    test.beforeEach(async ({ page, sauceUser }) => {
        loginPage = new LoginPage(page);
        storePage = new StorePage(page);
        await loginPage.navigate();
        await loginPage.login(sauceUser.username, sauceUser.password);
    });

    test('Proceso completo de compra', async ({ page, checkoutData }) => {
        await test.step('1. Login y preparación', async () => {
            await expect(page.locator('.inventory_list')).toBeVisible({
                timeout: 10000,
                message: 'La lista de productos debería estar visible después del login'
            });
        });

        // ...resto del código igual...
    });
});

test.describe('Escenarios Alternos de Compra', () => {
    let storePage;

    test.beforeEach(async ({ page, sauceUser }) => {
        const loginPage = new LoginPage(page);
        storePage = new StorePage(page);
        await loginPage.navigate();
        await loginPage.login(sauceUser.username, sauceUser.password);
    });

    test('Checkout sin productos', async () => {
        await storePage.goToCart();
        await storePage.validarCarritoVacio();
    });

    test('Formulario con campos vacíos', async () => {
        await storePage.addProductsToCart();
        await storePage.goToCart();
        await storePage.iniciarCheckout();
        await storePage.completarFormularioCheckout('', '', '');
        await storePage.validarErrorFormulario('Error: First Name is required');
    });

    test('Validar cambio en total al eliminar producto', async ({ page }) => {
        await storePage.addProductsToCart();
        const { totalBefore, totalAfter } = await storePage.removeProductFromCart(0);
        await expect(totalAfter).toBeLessThan(totalBefore);
        await storePage.verifyProductsInCart(1);
    });

    test('Validar formato de precios en resumen', async ({ checkoutData }) => {
        await storePage.addProductsToCart();
        await storePage.goToCart();
        await storePage.iniciarCheckout();
        await storePage.completarFormularioCheckout(
            checkoutData.firstName,
            checkoutData.lastName,
            checkoutData.postalCode
        );
        const precios = await storePage.validarFormatoPreciosResumen();
        console.log('Precios del resumen:', precios);
    });
});