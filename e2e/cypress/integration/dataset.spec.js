describe('Harvest Dataset Validation', () => {
    const harvestOrg = 'cypress-harvest-org'
    const dataJsonHarvestSoureName = 'cypress-harvest-datajson'
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso'
    
    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         * Harvest data sets for validation
         */
        cy.login('cypress-user', 'cypress-user-password')
        // Make sure organization does not exist before creating
        cy.delete_organization(harvestOrg)
        // Create the organization
        cy.create_organization(harvestOrg, harvestOrg, 'cypress harvest org description')
        cy.create_harvest_source('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        dataJsonHarvestSoureName,
                        'cypress test datajson',
                        'datajson',
                        harvestOrg)
        cy.create_harvest_source('https://www.sciencebase.gov/data/lcc/california/iso2/',
                        wafIsoHarvestSourceName,
                        'cypress test waf iso',
                        'waf',
                        harvestOrg)
        cy.start_harvest_job(dataJsonHarvestSoureName)
        cy.start_harvest_job(wafIsoHarvestSourceName)  
    })
    
    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })

    after(() => {
        cy.delete_harvest_source(wafIsoHarvestSourceName)
        cy.delete_harvest_source(dataJsonHarvestSoureName)
        cy.delete_organization(harvestOrg)
    })

    it('datajson dataset validation', () => {
        cy.visit('/dataset')
        cy.contains('Tags')
        cy.contains('Formats')
        cy.get('a').should('contain', 'Series of aerial images over Monte Vista National Wildlife Refuge, acquired in 1960').parent().click()
        cy.screenshot()
    })

    //it('waf dataset validation', () => {
    //    cy.visit('/dataset')
    //    cy.contains('Tags')
    //    cy.contains('Formats')
    //})
})