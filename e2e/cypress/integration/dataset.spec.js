describe('Harvest Dataset Validation', () => {
    const harvestOrg = 'cypress-harvest-org'
    const dataJsonHarvestSoureName = 'cypress-harvest-datajson'
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso'
    
    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         * Harvest data sets for validation
         */
         cy.login('cypress-user', 'cypress-user-password', false)
        // Make sure organization does not exist before creating
        cy.delete_organization(harvestOrg)
        // Create the organization
        cy.create_organization(harvestOrg, 'cypress harvest org description', false)
        cy.create_harvest_source('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        dataJsonHarvestSoureName,
                        'cypress test datajson',
                        'datajson',
                        harvestOrg,
                        false)
        cy.create_harvest_source('https://www.sciencebase.gov/data/lcc/california/iso2/',
                        wafIsoHarvestSourceName,
                        'cypress test waf iso',
                        'waf',
                        harvestOrg,
                        false)
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
        /**
         * Find a datajson data set, visit it, verify the publisher, publicity, bureau code, and bureau
         */
        //cy.visit('/dataset')
        cy.get('a[class="logo"]').click()
        cy.contains('Tags')
        cy.contains('Formats')
        //cy.get('a[href*="/dataset/series-of-aerial-images-over-monte-vista-national-wildlife-refuge-acquired-in-1960]"').click()//.should('contain', 'Series of aerial images over Monte Vista National Wildlife Refuge, acquired in 1960')
        cy.visit('/dataset/series-of-aerial-images-over-monte-vista-national-wildlife-refuge-acquired-in-1960')
        //cy.visit('/dataset/series-of-aerial-images-over-monte-vista-national-wildlife-refuge-acquired-in-1960')
        cy.get('a').should('contain', 'Download Metadata')
        cy.contains('Data.json Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').should('contain', 'public')
        cy.get('td').should('contain', '010:18')
        cy.get('a').should('contain', 'Todd Sutherland')
        cy.get('span').should('contain', 'Fish and Wildlife Service')
        //cy.visit('/harvest/object/f9a5a7de-b215-445d-97f2-6e8b086eaaec')
        cy.screenshot()
    })

    it('waf dataset validation', () => {
        cy.get('a[class="logo"]').click()
        cy.contains('Tags')
        cy.contains('Formats')
        cy.visit('/dataset/maps-projected-climate-change-and-urbanization-impacts-on-the-distribution-of-ceanothus-verruco')
        cy.get('a').should('contain', 'Download Metadata')
        cy.get('a[class="show-more"]').click()
    })
})