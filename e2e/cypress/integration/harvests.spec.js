let attempts = 5
function wait_for_element_to_exist () {
    /**
     * Incomplete method. Will finish method on 2021-06-21
     * Method to find element on page in cypress test after set amount of refreshes
     * :return Boolean: Returns the found element containing the correct value
     * TODO: Need to work around cy.wrap($td) being registered as undefined
     */
    let $td = Cypress.$('td')

    if (cy.wrap($td).should('contain', 'Finished')) {
        //let tdBool = $td.length >= 5
        //cy.log("Table log: "+ tdBool)
        return $td
    }

    if (--attempts) {
        cy.log('TD not found yet. Remaining attempts: ' + attempts);
        cy.reload(true)
        return cy.wait(18000).then(() => {
            return wait_for_element_to_exist()
        })
    }
}


describe('Datajson Harvest', () => {
    const harvestOrg = 'cypress-harvest-org'
    const harvestSourceName = 'cypress-harvest-datajson'

    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
        // Make sure organization does not exist before creating
        cy.delete_organization(harvestOrg)
        cy.create_organization(harvestOrg, harvestOrg, 'cypress harvest org description')
    })
    beforeEach(() => {
        // Keep session to stay logged in
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        // Clear harvest source
        cy.visit('/harvest/admin/' + harvestSourceName)
        cy.contains('Clear').click({force:true})
        
        cy.delete_harvest_source(harvestSourceName)
        cy.delete_organization(harvestOrg)
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
        cy.visit('/harvest/' + harvestSourceName)
        cy.contains('Admin').click()

        cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').click({force:true})
        // Should re-check each minute up to 5 minutes for completion:
        // https://stackoverflow.com/questions/62051641/cypress-reload-page-until-element-visible
        cy.wait(120000)
        cy.reload(true)
        //wait_for_element_to_exist().then($td => {
        //    cy.wrap($td).should('contain', 'Finished')
        //});
        cy.contains('0 not modified').should('have.class', 'label')
        cy.get('td').should('contain', 'Finished')
        cy.screenshot()
    })
})