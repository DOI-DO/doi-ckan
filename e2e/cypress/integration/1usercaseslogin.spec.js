describe('Login Page ', () => {
    Cypress.Commands.add('login', (user, pw) => {
        cy.visit('/user/login')
        cy.get('#field-login').type(user)
        cy.get('#field-password').type(pw)
        cy.get('form').submit()
        
    })
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
