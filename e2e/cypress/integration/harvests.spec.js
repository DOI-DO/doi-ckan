describe('Harvest', () => {
    const harvestOrg = 'cypress-harvest-org'
    const harvestSourceName = 'cypress-harvest-datajson'

    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
        //cy.delete_organization('cypress-harvest-org')
        cy.create_organization(harvestOrg, harvestOrg, 'cypress harvest org description')
        //try {
        //    cy.delete_harvest_source('cypress-harvest-datajson')
        //} catch (error) {
        //    console.log(error)
        //}
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    afterEach(() => {
        // Need to remove all data by clearing harvest source, and purging
        // harvest source with /api/action/dataset_purge
        // https://docs.ckan.org/en/2.8/api/index.html#ckan.logic.action.delete.dataset_purge
        // cy.delete_organization('cypress-test-org')
        // cy.delete_harvest_source('cypress-harvest-datajson')
    })
    it('Create datajson Harvest Source VALID', () => {
        cy.create_harvest_source('https://ecos.fws.gov/ServCat/OpenData/FWS_ServCat_v1_1.json',
                        harvestSourceName,
                        'cypress test datajson',
                        'datajson',
                        harvestOrg)
        cy.screenshot()
        cy.visit('/harvest/'+harvestSourceName)
        cy.screenshot()
    })
    it('Start datajson Harvest Job', () => {
        cy.visit('/harvest/admin/' + harvestSourceName)

        cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').click({force:true})
        // Should re-check each minute up to 5 minutes for completion:
        // https://stackoverflow.com/questions/62051641/cypress-reload-page-until-element-visible
        cy.wait(120000)
        cy.reload(true)
        cy.screenshot()
        // TODO: Should find Status row of table and validate that contains Finished
        cy.should('contain', 'Finished')
        // cy.visit('/dataset')
        // cy.screenshot()
        // cy.get('.module-heading span').should('contain', 'Tags')
    })
})