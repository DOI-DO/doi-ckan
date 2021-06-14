describe('Harvest', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
        cy.delete_organization('cypress-test-org')
        cy.create_organization('cypress-test-org', 'cypress-test-org', 'cypress test description')
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    it('Create datajson Harvest Source VALID', () => {
        cy.create_harvest('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        'cypress-harvest-datajson',
                        'cypress test datajson',
                        'datajson',
                        'cypress-test-org')
        //cy.visit('/harvest/new')
        cy.screenshot()
        //cy.get('#field-url').type('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json')
        //cy.get('#field-title').type('cypress-harvest')
        //cy.get('field-notes').type('cypress test')
        //cy.get('[type="radio"]').check('datajson')
        //cy.get('#field-private_datasets').check('False')
        //cy.get('#select2-result-label-9').select('cypress-test-org', {
        //    force: true
        //})
        //cy.get('#save').submit()
        //cy.screenshot()
        //cy.location('pathname').should('eq', '/harvest/cypress-harvest')
        //cy.get('h1.heading').should('contain', 'cypress-harvest')
    })
})