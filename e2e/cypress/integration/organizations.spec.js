describe('Organization', () => {
    const dcatOrg = 'dcat-us-org';
    before(() => {
        cy.login('admin', 'password', false)
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
        cy.visit('/organization/cypress-test-org')
    })
    it('Contains Organization Information', () => {
        cy.contains('No datasets found')
        cy.contains('cypress test description')
        cy.contains('0')
        cy.get('a[href="/organization/cypress-test-org"]')
    })
    // skipping test. harvesting uses an organization created with the API
    it.skip('can use api to create an organization with extras', () => {
        cy.create_dcat_org(dcatOrg);
    });
    it('Edit Organization Description', () => {
        cy.visit('/organization/edit/cypress-test-org')
        cy.get('#field-description').clear()
        cy.get('#field-description').type('the new description')
        cy.get('button[type=submit]').click()
    })
})
