describe('Cleanup site', () => {
    const harvestOrg = 'cypress-harvest-org'
    const dataJsonHarvestSoureName = 'cypress-harvest-datajson'
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso'

    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         */
        cy.login('cypress-user', 'cypress-user-password', false)

        // Clear and remove all harvested data
        // cy.delete_harvest_source(dataJsonHarvestSoureName)
        // cy.delete_harvest_source(wafIsoHarvestSourceName)

        // // Make sure organization does not exist before creating
        // cy.delete_organization(harvestOrg)
    })
    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })

    it('Confirms empty site', () => {
        cy.visit('/dataset');
        cy.contains("No datasets found");
        cy.visit('/organization');
        cy.contains("No organizations found");
    })
})