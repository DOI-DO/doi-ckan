describe('Security', () => {
    it('Does not redirect to a given site', () => {
        cy.request({
            url: '//google.com/',
            failOnStatusCode: false
        }).should((response) => {
            cy.log(response)
            expect(response.status).to.eq(404)
        })
        
    })

    it('Is HSTS compliant', () => {
        cy.request('/dataset').should((response) => {
            expect(response).to.have.property('headers');
            expect(response.headers).to.have.property('strict-transport-security');
            expect(response.headers['strict-transport-security']).to.equal('max-age=31536000;');
        })
        
    })
})