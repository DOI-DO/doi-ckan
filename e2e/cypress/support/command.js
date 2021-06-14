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
    cy.request({
        url: '/api/action/organization_create',
        method: 'POST',
        body: {
            "description": desc,
            "title": title,
            "id": orgName,
            "approval_status": "approved",
            "state": "active",
            "name": orgName
        },
        form: true
    })
})


Cypress.Commands.add('delete_organization', (orgName) => {
    cy.request({
        url: '/api/action/organization_purge',
        method: 'POST',
        body: {
            "id": orgName
        },
        form: false
    })
})


Cypress.Commands.add('create_harvest', (harvestUrl, harvestTitle, harvestDesc, harvestType, org) => {
    cy.visit('/harvest/new')
    cy.get('#field-url').type(harvestUrl)
    cy.get('#field-title').type(harvestTitle)
    cy.get('#field-notes').type(harvestDesc)
    cy.get('[type="radio"]').check(harvestType)
    cy.get('#field-private_datasets').check('False')
    cy.get('#select2-result-label-9').select(org, {
        force: true
    })
    cy.get('#save').submit()
})