it('INVALID USER LOGIN ATTEMPT', () => {
    cy.visit('/user/login')
    cy.get('#field-login').type('gilplatt')
    cy.get('#field-password').type('gilplatt')
    cy.get('form').submit()
    cy.get('.flash-messages .alert').should('contain', 'Login failed. Bad username or password.')
    cy.screenshot()
});


it('LOGIN AS TEST USER CORRECTLY', () => {
    cy.visit('/user/login')
    cy.get('#field-login').type('cypress-user')
    cy.get('#field-password').type('cypress-user-password')
    cy.get('form').submit()
    cy.get('.nav-tabs>li>a').should('contain', 'My Organizations')
    cy.screenshot()
});


