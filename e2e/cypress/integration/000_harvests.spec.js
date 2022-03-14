describe('Harvest', () => {
    // Rename this only if necessary, various test dependencies
    const dcatUsOrg = 'dcat-us-org'
    const dataJsonHarvestSoureName = 'cypress-harvest-datajson'
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso'
    const wafFgdcHarvestSourceName = 'cypress-harvest-waf-fgdc'

    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         */
        cy.login('admin', 'password', false)
        // Make sure organization does not exist before creating
        cy.delete_organization(dcatUsOrg)
        // Create the organization
        cy.create_dcat_org(dcatUsOrg);
    })
    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        /**
         * Do not clear harvest sources so other tests can use
         */
        // cy.delete_harvest_source(wafIsoHarvestSourceName)
        // cy.delete_harvest_source(dataJsonHarvestSoureName)
        // cy.delete_organization(harvestOrg)
    })
    it('Create datajson Harvest Source VALID', () => {
        /**
         * Test creating a valid datajson harvest source
         */
        //cy.get('a[href="/organization/edit/'+harvestOrg+'"]').click()
        cy.visit(`/organization/${dcatUsOrg}`)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+dcatUsOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('http://nginx-harvest-source/data.json',
                        dataJsonHarvestSoureName,
                        'cypress test datajson',
                        'datajson',
                        dcatUsOrg,
                        true,
                        false)

        // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
        cy.location('pathname').should('eq', '/harvest/' + dataJsonHarvestSoureName)
    })
    it('Create a datajson harvest source INVALID', () => {
        cy.visit('/organization/'+dcatUsOrg)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+dcatUsOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('😀',
                        'invalid datajson',
                        'invalid datajson',
                        'datajson',
                        dcatUsOrg,
                        true,
                        true)
        cy.contains('URL: Missing value')
    })
    it('Search harvest source', () => {
        cy.visit('/harvest')
        cy.get('#field-giant-search').type('datajson')
        cy.contains('1 harvest found')
    })
    it('Start datajson Harvest Job', () => {
        cy.start_harvest_job(dataJsonHarvestSoureName)
    })
    it('Create WAF ISO Harvest Source', () => {
        /**
         * Create a WAF ISO Harvest Source
         */
        cy.visit('/organization/'+dcatUsOrg)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+dcatUsOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('http://nginx-harvest-source/iso-waf/',
           wafIsoHarvestSourceName,
           'cypress test waf iso',
           'waf',
           dcatUsOrg,
           true,
           false)
        // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
        cy.location('pathname').should('eq', '/harvest/' + wafIsoHarvestSourceName)
    })

    it('Start WAF ISO Harvest Job', () => {
        cy.start_harvest_job(wafIsoHarvestSourceName)
    })

    it('Create a WAF FGDC Harvest Source', () => {
        cy.visit('/organization/'+dcatUsOrg)
        cy.get('a[class="btn btn-primary"]').click()
        cy.get('a[href="/harvest?organization='+dcatUsOrg+'"]').click()
        cy.get('a[class="btn btn-primary"]').click()
        cy.create_harvest_source('http://nginx-harvest-source/fgdc-waf/',
            wafFgdcHarvestSourceName,
           'cypress test waf fgdc',
           'waf',
           dcatUsOrg,
           true,
           false);
    });

    it('Start WAF FGDC harvest Job', () => {
        cy.start_harvest_job(wafFgdcHarvestSourceName)
    });
})
