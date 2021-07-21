describe('Harvest Dataset Validation', () => {
    const harvestOrg = 'cypress-validation-org'
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
                        false,
                        false)
        cy.create_harvest_source('https://www.sciencebase.gov/data/lcc/south-atlantic/iso2/',
                        wafIsoHarvestSourceName,
                        'cypress test waf iso',
                        'waf',
                        harvestOrg,
                        false,
                        false)
        cy.start_harvest_job(dataJsonHarvestSoureName)
        cy.start_harvest_job(wafIsoHarvestSourceName)
        //cy.get('td').should('contain', '2 added')  
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

    it('show that datasets exist on main page', () => {
        /**
         * Find a datajson data set, visit it, verify the publisher, publicity, bureau code, and bureau
         */
        //cy.visit('/dataset')
        cy.get('a[class="logo"]').click()
        cy.contains('Tags')
        //cy.contains('Formats')
        
        //cy.get('a[href*="/dataset/series-of-aerial-images-over-monte-vista-national-wildlife-refuge-acquired-in-1960]"').click()
        
        //.should('contain', 'Series of aerial images over Monte Vista National Wildlife Refuge, acquired in 1960')
        //cy.visit('/dataset/series-of-aerial-images-over-monte-vista-national-wildlife-refuge-acquired-in-1960')
    })

    it('test search functionality', () => {
        cy.get('a[class="logo"]').click()
        cy.get('input[id="search-big"]').type('Series of aerial images over Baca National Wildlife Refuge, acquired November, 1941')
        cy.contains('datasets found')
    })

    it('validates data json metadata', () => {
        cy.visit('/dataset/series-of-aerial-images-over-alamosa-national-wildlife-refuge-acquired-november-1941')
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
        //cy.contains('Formats')
        cy.visit('/dataset/blueprint-1-0-map')
        cy.get('a').should('contain', 'Download Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').contains('eng; USA')
        cy.get('td').contains('geospatial')
        cy.screenshot()
    })
})