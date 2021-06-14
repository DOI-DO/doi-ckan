describe('Login', () => {
    it('Invalid user login attempt', () => {
        cy.login('gilplatt', 'gilplatt')
        cy.get('.flash-messages .alert').should('contain', 'Login failed. Bad username or password.')
        cy.screenshot()
    });
    it('Valid login attempt', () => {
        cy.login('cypress-user', 'cypress-user-password')
        cy.get('.nav-tabs>li>a').should('contain', 'My Organizations')
        cy.screenshot()
    })

})
