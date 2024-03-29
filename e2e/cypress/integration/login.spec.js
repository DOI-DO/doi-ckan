describe('Login', () => {
    it('Invalid user login attempt', () => {
        cy.visit('/dataset')
        cy.get('a[href="/user/login"]').click()
        cy.login('gilplatt', 'gilplatt', true)
        cy.get('.flash-messages .alert').should('contain', 'Login failed. Bad username or password.')
    });
    it('Valid login attempt', () => {
        cy.visit('/dataset')
        cy.get('a[href="/user/login"]').click()
        cy.login('admin', 'password', true)
        cy.get('.nav-tabs>li>a').should('contain', 'My Organizations')
    })

})
