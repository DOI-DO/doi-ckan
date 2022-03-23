describe('DCAT-US file export', () => {
    const harvestOrg = 'dcat-us-org'

    it('Can validate that the dcat-us file is valid JSON', () => {
        cy.request(`/data.json`).should((response) => {
            expect(response.status).to.eq(200)
            //let dcat_us = JSON.parse(response.body)
            cy.wrap(JSON.parse(response.body)['dataset'].length).should('eq', 9)

        })
    })

    it('Can download organization dcat-us file', () => {
        cy.request(`/organization/${harvestOrg}/data.json`).should((response) => {
            expect(response.status).to.eq(200)
            //let dcat_us = JSON.parse(response.body)
            cy.wrap(JSON.parse(response.body)['dataset'].length).should('eq', 9)
        })
    })
})
