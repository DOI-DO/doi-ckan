it('loads page', () => {
    cy.visit('/dataset')
    cy.contains('No datasets')
})

it('LOGIN AS TEST USER CORRECTLY', () => {
    cy.visit('/user/login')
    cy.get('#field-login').type('cypress-user')
    cy.get('#field-password').type('cypress-user-password')
    cy.get('form').submit()
});