describe('Security', () => {
    // before(() => {
    //     cy.login('cypress-user', 'cypress-user-password', false)
    // })
    // beforeEach(() => {
    //     Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    // })
    // after(() => {
    //     cy.delete_organization('cypress-test-org')
    // })
    it('Does not redirect to a given site', () => {
        cy.request({
            url: '//google.com/',
            failOnStatusCode: false
        }).should((response) => {
            cy.log(response)
            expect(response.status).to.eq(404)
        })
        
    })
})