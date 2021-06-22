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
Cypress.Commands.add('login', (userName, password, loginTest) => {
    /**
     * Method to fill and submit the DOI CKAN Login form
     * :PARAM userName String: user name of that will be attempting to login
     * :PARAM password String: password for the user logging in
     * :RETURN null:
     */
    if (!loginTest) {
        cy.visit('/user/login')
    }
    cy.get('#field-login').type(userName)
    cy.get('#field-password').type(password)
    cy.get('form').submit()
})


Cypress.Commands.add('create_organization', (orgName, orgDesc, orgTest) => {
    /**
     * Method to fill out the form to create a DOI CKAN organization
     * :PARAM orgName String: Name of the organization being created
     * :PARAM orgDesc String: Description of the organization being created
     * :PARAM orgTest Boolean: Control value to determine if to use UI to create organization 
     *      for testing or to visit the organization creation page
     * :RETURN null:
     */

    if (!orgTest) {
        cy.visit('/organization/new')
    }
    cy.get('#field-name').type(orgName)
    cy.get('#field-description').type(orgDesc)
    cy.get('#field-url').then($field_url => {
        if($field_url.is(':visible')) {
            $field_url.type(orgName)
        }
    })
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


Cypress.Commands.add('create_harvest_source', (dataSourceUrl, harvestTitle, harvestDesc, harvestType, org, harvestTest) => {
    /**
     * Method to create a new CKAN DOI harvest source via the CKAN DOI harvest form
     * :PARAM dataSourceUrl String: URL to source the data that will be harvested
     * :PARAM harvestTitle String: Title of the organization's harvest
     * :PARAM harvestDesc String: Description of the harvest being created
     * :PARAM harvestType String: Harvest source type. Ex: waf, datajson
     * :PARAM org String: Organization that is creating the harvest source
     * :PARAM harvestTest Boolean: Determines if to use UI in harvest source creation test or to follow the UI to create a source
     * :RETURN null:
     */
    if (!harvestTest) {
        cy.visit('/harvest/new')
    }
    cy.get('#field-url').type(dataSourceUrl)
    cy.get('#field-title').type(harvestTitle)
    cy.get('#field-name').then($field_name => {
        if($field_name.is(':visible')) {
            $field_name.type(harvestTitle)
        }
    })

    cy.get('#field-notes').type(harvestDesc)
    cy.get('[type="radio"]').check(harvestType)
    if(harvestType == 'waf'){
        //cy.get('#text').then($text => {
        //    if($text.val() == 'Validation'){
        //        
        //    }
        //})
        cy.get('[type="radio"]').check('iso19139ngdc')
    }

    // Set harvest to be public always, per best practices
    cy.get('#field-private_datasets').select('False')
    
    cy.get('input[name=save]').click()
    // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
    cy.location('pathname').should('eq', '/harvest/' + harvestTitle)
})


Cypress.Commands.add('delete_harvest_source', (harvestName) => {
    cy.visit('/harvest/admin/' + harvestName)
    cy.contains('Clear').click({force:true})
    cy.visit('/harvest/delete/'+harvestName+'?clear=True')
    
})


Cypress.Commands.add('start_harvest_job', (harvestName) => {
    cy.visit('/harvest/' + harvestName)
    cy.contains('Admin').click()
    cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').click({force:true})
    cy.wait(120000)
    cy.reload(true)
    cy.contains('0 not modified').should('have.class', 'label')
    cy.get('td').should('contain', 'Finished')
})