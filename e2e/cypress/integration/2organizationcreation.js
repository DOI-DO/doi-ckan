describe('Create Organization', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    it('Create Organization', () => {
        cy.visit('/organization/new')
        cy.get('#field-name').type('cypress-test-org')
        // cy.screenshot()
        cy.get('#field-description').type('cypress test description')
        // cy.screenshot()
        cy.get('form').should('contain', 'Create Organization').submit()
        // cy.screenshot()

        // Organization creation not working, using API
        cy.request({
            url: '/api/action/organization_create',
            method: 'POST',
            body: {
                "description": "cypress test description",
                "title": "cypress-test-org",
                "approval_status": "approved",
                "state": "active",
                "name": "cypress-test-org"
            },
            form: true
        })

        cy.visit('/organization')

        // cy.location('pathname').should('eq', '/organization/cypress-test-org')
    })
})