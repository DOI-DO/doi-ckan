describe('Organization', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password', false)
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        cy.delete_organization('cypress-test-org')
    })
    it('Create Organization', () => {
        cy.visit('/dataset')
        cy.get('a[class="btn btn_new"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_organization('cypress-test-org', 'cypress test description', true)
        cy.screenshot()
        cy.visit('/organization/cypress-test-org')
        cy.screenshot()
    })
    it('Edit Organization Description', () => {
        cy.visit('/organization/edit/cypress-test-org')
        //cy.get('#field-url').then($field_url => {
        //    if($field_url.is(':visible')) {
        //        $field_url.type(orgName)
        //    }
        //})
        //cy.get('a[class="btn btn-primary"]').click()
        cy.get('#field-description').clear()
        cy.get('#field-description').type('the new description')
        cy.screenshot()
        cy.get('button[type=submit]').click()
    })
})