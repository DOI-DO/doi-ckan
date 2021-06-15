describe('Harvest', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
        //cy.delete_organization('cypress-harvest-org')
        cy.create_organization('cypress-harvest-org', 'cypress-harvest-org', 'cypress harvest org description')
        //try {
        //    cy.delete_harvest_source('cypress-harvest-datajson')
        //} catch (error) {
        //    console.log(error)
        //}
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        // Need to remove all data by clearing harvest source, and purging
        // harvest source with /api/action/dataset_purge
        // https://docs.ckan.org/en/2.8/api/index.html#ckan.logic.action.delete.dataset_purge
        // cy.delete_organization('cypress-test-org')
        cy.delete_harvest_source('cypress-harvest-datajson')
    })
    it('Create datajson Harvest Source VALID', () => {
        cy.create_harvest_source('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        'cypress-harvest-datajson',
                        'cypress test datajson',
                        'datajson',
                        'cypress-test-org')
        cy.screenshot()
        cy.visit('/harvest/cypress-harvest-datajson')
        cy.screenshot()
    })
})