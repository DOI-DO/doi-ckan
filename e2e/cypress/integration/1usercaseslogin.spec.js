describe('Login Page ', () => {
    it('INVALID USER LOGIN ATTEMPT', () => {
        cy.login('gilplatt', 'gilplatt')
        cy.get('.flash-messages .alert').should('contain', 'Login failed. Bad username or password.')
        cy.screenshot()
    });
    it('LOGIN AS TEST USER CORRECTLY', () => {
        cy.login('cypress-user', 'cypress-user-password')
        cy.get('.nav-tabs>li>a').should('contain', 'My Organizations')
        cy.screenshot()
    })

})
