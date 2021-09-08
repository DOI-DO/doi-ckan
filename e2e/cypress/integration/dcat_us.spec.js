describe('DCAT-US file export', () => {
    const harvestOrg = 'cypress-harvest-org'

    it('Can validate that the dcat-us file is cached', () => {
        let time0 = performance.now();
        let firstVisit = 0;

        cy.request('/data.json')
        cy.wrap(performance.now()).then(time1 => {
            firstVisit = time1-time0
            cy.log(`PERFORMANCE SPEED FOR FIRST VISIT: ${time1-time0}`)
            cy.wrap(firstVisit).should('be.lte', 2)
        })
    })

    it('Can download organization dcat-us file', () => {

        cy.request(`/organization/${harvestOrg}/data.json`).should((response) => {
            expect(response.status).to.eq(200)
            //let dcat_us = JSON.parse(response.body)
            cy.wrap(JSON.parse(response.body)['dataset'].length).should('eq', 8)
        })
    })
})