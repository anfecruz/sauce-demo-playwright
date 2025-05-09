const { expect } = require('@playwright/test');

class StorePage {
    constructor(page) {
        this.page = page;
        // Locators del carrito
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartItems = page.locator('.cart_item');
        this.itemPrices = page.locator('.inventory_item_price');
        this.removeButtons = page.locator('[data-test^="remove"]');
        
        // Locators de checkout
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.checkoutInfo = page.locator('.checkout_info');
        this.emptyCartContainer = page.locator('.cart_contents_container');

        // Locators para el formulario
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');

        // Locators para el resumen de la orden
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.finishButton = page.locator('[data-test="finish"]');
        this.successMessage = page.locator('.complete-header');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async addProductsToCart() {
        const buttons = await this.addToCartButtons.all();
        for(let i = 0; i < 2; i++) {
            await buttons[i].click();
            await this.page.waitForTimeout(500);
        }
    }

    async verifyProductsInCart(expectedCount) {
        await expect(this.cartBadge).toBeVisible({ 
            timeout: 10000,
            message: 'El badge del carrito debería ser visible'
        });
        await expect(this.cartBadge).toHaveText(String(expectedCount));
    }

    async goToCart() {
        await this.cartLink.click();
        await expect(this.emptyCartContainer).toBeVisible({
            timeout: 10000,
            message: 'El contenedor del carrito debería ser visible'
        });
    }

    async verifyCartProducts() {
        await expect(this.cartItems).toHaveCount(2, {
            timeout: 10000,
            message: 'Deberían haber 2 items en el carrito'
        });

        const prices = await this.itemPrices.allTextContents();
        prices.forEach(price => {
            expect(price).toMatch(/^\$\d+\.\d{2}$/);
        });
    }

    async iniciarCheckout() {
        await this.checkoutButton.click();
        await expect(this.checkoutInfo).toBeVisible({
            timeout: 10000,
            message: 'La página de checkout debería estar visible'
        });
    }

    async completarFormularioCheckout(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();

        if (!firstName) {
            await expect(this.errorMessage).toBeVisible({
                timeout: 5000,
                message: 'Debería mostrarse un mensaje de error'
            });
            return;
        }
        
        await expect(this.page.locator('.checkout_summary_container')).toBeVisible({
            timeout: 10000,
            message: 'El resumen del checkout debería ser visible'
        });
    }

    async validarResumenOrden() {
        const subtotalText = await this.subtotalLabel.textContent();
        const taxText = await this.taxLabel.textContent();
        const totalText = await this.totalLabel.textContent();

        const subtotal = this.extraerPrecio(subtotalText);
        const tax = this.extraerPrecio(taxText);
        const total = this.extraerPrecio(totalText);

        await expect(subtotal).toBeGreaterThan(0);
        await expect(tax).toBeGreaterThan(0);
        await expect(total).toBe(subtotal + tax);
    }

    async confirmarCompra() {
        await this.finishButton.click();
        await expect(this.successMessage).toBeVisible({ 
            timeout: 15000,
            message: 'El mensaje de éxito debería ser visible'
        });
        await expect(this.successMessage).toHaveText('Thank you for your order!');
    }

    async removeProductFromCart(index) {
        await this.goToCart();
        
        const preciosIniciales = await this.itemPrices.allTextContents();
        const totalBefore = preciosIniciales.reduce((sum, price) => {
            return sum + this.extraerPrecio(price);
        }, 0);
        
        const botonesEliminar = await this.removeButtons.all();
        await botonesEliminar[index].click();
        await this.page.waitForTimeout(2000);
        
        const preciosFinales = await this.itemPrices.allTextContents();
        const totalAfter = preciosFinales.reduce((sum, price) => {
            return sum + this.extraerPrecio(price);
        }, 0);

        console.log(`Total antes: $${totalBefore}, Total después: $${totalAfter}`);
        return { totalBefore, totalAfter };
    }

    async validarCarritoVacio() {
        await expect(this.cartItems).toHaveCount(0, {
            timeout: 10000,
            message: 'El carrito debería estar vacío'
        });
        await expect(this.emptyCartContainer).toBeVisible({
            timeout: 10000,
            message: 'El contenedor de carrito vacío debería ser visible'
        });
    }

    async validarErrorFormulario(expectedError) {
        await expect(this.errorMessage).toBeVisible({
            timeout: 5000,
            message: 'El mensaje de error debería ser visible'
        });
        await expect(this.errorMessage).toContainText(expectedError);
    }

    async intentarCheckoutSinProductos() {
        await this.goToCart();
        await this.validarCarritoVacio();
        
        const isCheckoutEnabled = await this.checkoutButton.isEnabled();
        if (isCheckoutEnabled) {
            await this.checkoutButton.click();
            await expect(this.page.locator('.error-message-container')).toBeVisible({
                timeout: 5000,
                message: 'Debería mostrarse un mensaje de error'
            });
        } else {
            console.log('El botón de checkout está correctamente deshabilitado');
        }
    }

    async validarFormatoPreciosResumen() {
        await expect(this.subtotalLabel).toBeVisible({
            timeout: 10000,
            message: 'El subtotal debería ser visible'
        });
        await expect(this.taxLabel).toBeVisible({
            timeout: 10000,
            message: 'El impuesto debería ser visible'
        });
        await expect(this.totalLabel).toBeVisible({
            timeout: 10000,
            message: 'El total debería ser visible'
        });

        const subtotalText = await this.subtotalLabel.textContent();
        const taxText = await this.taxLabel.textContent();
        const totalText = await this.totalLabel.textContent();

        const precioRegex = /\$\d+\.\d{2}/;
        
        const subtotalMatch = subtotalText.match(precioRegex);
        const taxMatch = taxText.match(precioRegex);
        const totalMatch = totalText.match(precioRegex);

        expect(subtotalMatch).not.toBeNull();
        expect(taxMatch).not.toBeNull();
        expect(totalMatch).not.toBeNull();

        expect(subtotalText).toContain('Item total:');
        expect(taxText).toContain('Tax:');
        expect(totalText).toContain('Total:');

        return {
            subtotal: subtotalMatch[0],
            tax: taxMatch[0],
            total: totalMatch[0]
        };
    }

    extraerPrecio(texto) {
        return parseFloat(texto.replace(/[^\d.]/g, ''));
    }
}

module.exports = { StorePage };