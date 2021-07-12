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
        cy.create_harvest_source('https://www.sciencebase.gov/data/lcc/appalachian/iso2/',
                        wafIsoHarvestSourceName,
                        'cypress test waf iso',
                        'waf',
                        harvestOrg,
                        false,
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

    it('Can validate that the dcat-us file is cached', () => {
        let time0 = performance.now();
        let firstVisit = 0;

        cy.request('/data.json')
        cy.wrap(performance.now()).then(time1 => {
            firstVisit = time1-time0
            cy.writeFile('performance_log.txt', `PERFORMANCE SPEED FOR FIRST VISIT: ${time1-time0}`)
        })
        cy.screenshot()

        let time2 = performance.now();
        let cachedVisit = 0

        cy.request('/data.json')
        cy.wrap(performance.now()).then(time3 => {
            cachedVisit = time3-time2
            cy.writeFile('performance_log1.txt', `PERFORMANCE SPEED FOR CACHED VISIT: ${time3-time2}`)
        })
        cy.wrap(firstVisit).should('be.gte', cachedVisit)
        cy.screenshot()
    })

    it('Can generate a dcat-us file', () => {
        /**
         * Request the dcat-us export from the site
         */

        //cy.visit('/data.json')
        //let query = document.querySelector('pre').innerHTML
        //let jsonVar = JSON.parse(query)
        //cy.wrap(jsonVar['dataset'].length).should('be.gte', 172)

        cy.screenshot()
        cy.request('/data.json').should((response) => {
            expect(response.status).to.eq(200)
            //let dcat_us = JSON.parse(response.body)
            cy.wrap(response.body['dataset'].length).should('be.gte', 172)
        })
    })
})