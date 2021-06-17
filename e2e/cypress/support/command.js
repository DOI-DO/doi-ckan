// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (userName, password) => {
    /**
     * Method to fill and submit the DOI CKAN Login form
     * :PARAM userName String: user name of that will be attempting to login
     * :PARAM password String: password for the user logging in
     * :RETURN null:
     */
    cy.visit('/user/login')
    cy.get('#field-login').type(userName)
    cy.get('#field-password').type(password)
    cy.get('form').submit()
})


Cypress.Commands.add('create_organization', (orgName, orgDesc) => {
    /**
     * Method to fill out the form to create a DOI CKAN organization
     * :PARAM orgName String: Name of the organization being created
     * :PARAM orgDesc String: Description of the organization being created
     * :RETURN null:
     */
    cy.visit('/organization/new')
    cy.get('#field-name').type(orgName)
    cy.get('#field-description').type(orgDesc)
    cy.get('button[type=submit]').click()
})


Cypress.Commands.add('delete_organization', (orgName) => {
    /**
     * Method to purge an organization from the current state
     * :PARAM orgName String: Name of the organization to purge from the current state
     * :RETURN null:
     */
    cy.request({
        url: '/api/action/organization_purge',
        method: 'POST',
        failOnStatusCode: false,
        body: {
            "id": orgName
        }
    })
})


Cypress.Commands.add('create_harvest_source', (dataSourceUrl, harvestTitle, harvestDesc, harvestType, org) => {
    /**
     * Method to create a new CKAN DOI harvest source via the CKAN DOI harvest form
     * :PARAM dataSourceUrl String: URL to source the data that will be harvested
     * :PARAM harvestTitle String: Title of the organization's harvest
     * :PARAM harvestDesc String: Description of the harvest being created
     * :PARAM harvestType String: Harvest source type. Ex: waf, datajson
     * :PARAM org String: Organization that is creating the harvest source
     * :RETURN null:
     */
    cy.visit('/harvest/new')
    cy.get('#field-url').type(dataSourceUrl)
    cy.get('#field-title').type(harvestTitle)
    cy.get('#field-name').then($field_name => {
        if($field_name.is(':visible')) {
            $field_name.type(harvestTitle)
        }
    })

    cy.get('#field-notes').type(harvestDesc)
    cy.get('[type="radio"]').check(harvestType)
    // Set harvest to be public always, per best practices
    cy.get('#field-private_datasets').select('False')
    
    cy.get('input[name=save]').click()
    // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
    cy.location('pathname').should('eq', '/harvest/' + harvestTitle)
})


Cypress.Commands.add('delete_harvest_source', (harvestName) => {
    cy.visit('/harvest/delete/'+harvestName+'?clear=True')
    // TODO: purging harvest source with /api/action/dataset_purge
    // https://docs.ckan.org/en/2.8/api/index.html#ckan.logic.action.delete.dataset_purge
})


Cypress.Commands.add('start_havest_job', (harvestName) => {
    
})