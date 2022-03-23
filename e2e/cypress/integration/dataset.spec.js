describe('Dataset', () => {

    it('show that datasets exist on main page', () => {
        /**
         * Find a datajson data set, visit it, verify the publisher, publicity, bureau code, and bureau
         */
        cy.visit('/dataset')
        cy.get('a[class="logo"]').click()
        cy.contains('Tags')
    })

    it('test search functionality', () => {
        cy.get('a[class="logo"]').click()
        cy.get('input[id="search-big"]').type('Series')
        cy.contains('datasets found')
    })

    it('validates data json metadata', () => {
        // Go to the harvest list, and select the first dataset
        cy.visit('/harvest/cypress-harvest-datajson');
        cy.get('a[href*="/dataset/concur-travel-parent"]').click();
        cy.get('a').should('contain', 'Download Metadata')
        cy.contains('Data.json Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').should('contain', 'public')
        cy.get('td').should('contain', '023:00')
        cy.get('span').should('contain', 'General Services Administration')
    })

    it('waf iso dataset validation', () => {
        // Go to the harvest list, and select the first dataset
        cy.visit('/harvest/cypress-harvest-waf-iso');
        cy.get('a[href*="/dataset/ek500-water-column-sonar-data-collected-during-al0001"]').first().click();

        cy.get('a').should('contain', 'Download Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').contains('eng; USA')
        cy.get('td').contains('geospatial')
    })

    if('waf fgdc dataset validation', () => {
        cy.visit('/harvest/cypress-harvest-waf-iso');
        cy.get('a[href*="/dataset/blm-rea-nwp-2011-ae-c-aquatic-ecosystem-threats-ag"]').first().click();

        cy.get('a').should('contain', 'Download Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').contains('eng; USA')
        cy.get('td').contains('geospatial')
    });
})