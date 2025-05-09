const { expect } = require('@playwright/test');

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        this.page = page;
        // Locators de login
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');

        // Locators de menú y logout
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.inventoryList = page.locator('.inventory_list');
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
        await expect(this.loginButton).toBeVisible();
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async validarMensajeError(expectedError) {
        await expect(this.errorMessage).toBeVisible({
            timeout: 5000,
            message: 'El mensaje de error debería ser visible'
        });
        await expect(this.errorMessage).toHaveText(expectedError);
    }

    async validarRedirectInventario() {
        await expect(this.inventoryList).toBeVisible({
            timeout: 5000,
            message: 'No se redirigió a la página de inventario'
        });
        await expect(this.page.url()).toContain('/inventory.html');
    }

    async logout() {
        await this.menuButton.click();
        await expect(this.logoutLink).toBeVisible({
            timeout: 5000,
            message: 'El enlace de logout debería ser visible'
        });
        await this.logoutLink.click();
    }

    async validarRedirectLogin() {
        await expect(this.loginButton).toBeVisible({
            timeout: 5000,
            message: 'No se redirigió a la página de login'
        });
        await expect(this.page.url()).toBe('https://www.saucedemo.com/');
        
        // Validar que los elementos del login están visibles
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }
}

module.exports = { LoginPage };