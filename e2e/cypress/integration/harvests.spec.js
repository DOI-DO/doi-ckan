let attempts = 5
function wait_for_element_to_exist () {
    /**
     * Incomplete method. Will finish method on 2021-06-21
     * Method to find element on page in cypress test after set amount of refreshes
     * :return Boolean: Returns the found element containing the correct value
     * TODO: Need to work around cy.wrap($td) being registered as undefined
     */
    let $label = Cypress.$('label')
    cy.reload(true)
    if ($label.length >= 1) {
        //let tdBool = $td.length >= 5
        //cy.log("Table log: "+ tdBool)
        cy.log('Found label element')
        return $label
    } else if (--attempts) {
        cy.wait(18000)
        cy.log('Label not found yet. Remaining attempts: ' + attempts);
        return wait_for_element_to_exist()
    }
}


describe('Datajson Harvest', () => {
    const harvestOrg = 'cypress-harvest-org'
    const dataJsonHarvestSoureName = 'cypress-harvest-datajson'
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso'

    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         */
        cy.login('cypress-user', 'cypress-user-password', false)
        // Make sure organization does not exist before creating
        cy.delete_organization(harvestOrg)
        // Create the organization
        cy.create_organization(harvestOrg, 'cypress harvest org description', false)
    })
    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        /**
         * Clear harvest sources
         */
        cy.delete_harvest_source(wafIsoHarvestSourceName)
        cy.delete_harvest_source(dataJsonHarvestSoureName)
        cy.delete_organization(harvestOrg)
    })
    it('Create datajson Harvest Source VALID', () => {
        /**
         * Test creating a valid datajson harvest source
         */
        //cy.get('a[href="/organization/edit/'+harvestOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+harvestOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        dataJsonHarvestSoureName,
                        'cypress test datajson',
                        'datajson',
                        harvestOrg,
                        true,
                        false)
        cy.screenshot()
       // cy.visit('/harvest/'+dataJsonHarvestSoureName)
        // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
        cy.location('pathname').should('eq', '/harvest/' + dataJsonHarvestSoureName)
        cy.screenshot()
    })
    it('Create a datajson harvest source INVALID', () => {
        cy.visit('/organization/'+harvestOrg)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+harvestOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('😀',
                        'invalid datajson',
                        'invalid datajson',
                        'datajson',
                        harvestOrg,
                        true,
                        true)
        cy.contains('URL: Missing value')
        cy.screenshot()
    })
    it('Search harvest source', () => {
        cy.visit('/harvest')
        cy.get('#field-giant-search').type('datajson')
        cy.contains('1 harvest found')
    })
    it('Start datajson Harvest Job', () => {
        /**
         * Test running the datajson harvest job
         */
        //cy.visit('/harvest/' + dataJsonHarvestSoureName)
        //cy.contains('Admin').click()
        //cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').click({force:true})
        //cy.wait(120000)
        //cy.reload(true)
        //cy.contains('0 not modified').should('have.class', 'label')
        //cy.get('td').should('contain', 'Finished')
        cy.start_harvest_job(dataJsonHarvestSoureName)
        // Should re-check each minute up to 5 minutes for completion:
        // https://stackoverflow.com/questions/62051641/cypress-reload-page-until-element-visible
        cy.screenshot()
    })
    it('Create WAF ISO Harvest Source', () => {
        /**
         * Create a WAF ISO Harvest Source
         */
        cy.visit('/organization/'+harvestOrg)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+harvestOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('https://www.sciencebase.gov/data/lcc/appalachian/iso2/',
           wafIsoHarvestSourceName,
           'cypress test waf iso',
           'waf',
           harvestOrg,
           true,
           false)
        // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
        cy.location('pathname').should('eq', '/harvest/' + wafIsoHarvestSourceName)
    })

    it('Start WAF ISO Harvest Job', () => {
        //cy.visit('/harvest/' + wafIsoHarvestSourceName)
        cy.start_harvest_job(wafIsoHarvestSourceName)
        //cy.contains('Admin').click()
        //cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').click({force:true})
        //cy.wait(120000)
        //cy.reload(true)
        //cy.contains('0 not modified').should('have.class', 'label')
        //cy.get('td').should('contain', 'Finished')
        //cy.screenshot()
        
    })
})