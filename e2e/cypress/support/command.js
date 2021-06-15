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
Cypress.Commands.add('login', (user, pw) => {
    cy.visit('/user/login')
    cy.get('#field-login').type(user)
    cy.get('#field-password').type(pw)
    cy.get('form').submit()
})


Cypress.Commands.add('create_organization', (orgName, title, desc) => {
    cy.visit('/organization/new')
    cy.get('#field-name').type(orgName)
    cy.get('#field-description').type(desc)
    cy.get('button[type=submit]').click()
})


Cypress.Commands.add('delete_organization', (orgName) => {
    cy.request({
        url: '/api/action/organization_purge',
        method: 'POST',
        body: {
            "id": orgName
        }
    })
})


Cypress.Commands.add('create_harvest', (harvestUrl, harvestTitle, harvestDesc, harvestType, org) => {
    cy.visit('/harvest/new')
    cy.get('#field-url').type(harvestUrl)
    cy.get('#field-title').type(harvestTitle)
    cy.get('#field-notes').type(harvestDesc)
    cy.get('[type="radio"]').check(harvestType)
    // Set harvest to be public always, per best practices
    cy.get('#field-private_datasets').select('False')
    
    cy.get('input[name=save]').click()
    // harvestTitle must not contain spaces, otherwise the URL redirect will not confirm
    cy.location('pathname').should('eq', '/harvest/' + harvestTitle)
})