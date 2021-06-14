describe('Harvest', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
        //cy.delete_organization('cypress-test-org')
        cy.create_organization('cypress-test-org', 'cypress-test-org', 'cypress test description')
    })
    beforeEach(() => {
        //Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        cy.delete_organization('cypress-test-org')
    })
    it('Create datajson Harvest Source VALID', () => {
        cy.create_harvest('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        'cypress-harvest-datajson',
                        'cypress test datajson',
                        'datajson',
                        'cypress-test-org')
        cy.screenshot()
        cy.visit('/harvest')
        cy.screenshot()
    })
})