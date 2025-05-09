const { test: base, expect } = require('@playwright/test');

exports.test = base.extend({
    sauceUser: async ({}, use) => {
        await use({ 
            username: 'standard_user', 
            password: 'secret_sauce' 
        });
    },
    checkoutData: async ({}, use) => {
        await use({
            firstName: 'Juan',
            lastName: 'Perez',
            postalCode: '12345'
        });
    },
    users: async ({}, use) => {
        await use({
            standard: {
                username: 'standard_user',
                password: 'secret_sauce'
            },
            locked: {
                username: 'locked_out_user',
                password: 'secret_sauce'
            }
        });
    }
});