describe('Harvests Page', () => {
    Cypress.Commands.add('login', (user, pw) => {
        cy.visit('/user/login')
        cy.get('#field-login').type(user)
        cy.get('#field-password').type(pw)
        cy.get('form').submit()
        
    })
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    it('Create Organization', () => {
        //cy.exec("curl --silent --fail 'http://ckan-web:5000/login_generic?came_from=/user/logged_in' --compressed -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: http://ckan-web:5000' -H 'Referer: http://ckan-web:5000/user/login' --data 'login=cypress-user&password=cypress-user-password' --cookie-jar ./cookie-jar")
        //var cookieFile = cy.readFile('./e2e/cookie-jar')
        cy.visit('/organization/new')
        cy.get('#field-name').type('cypress-test-org')
        cy.screenshot()
        cy.get('#field-description').type('cypress test description')
        cy.screenshot()
        cy.get('form').submit()
        cy.screenshot()
    })
})