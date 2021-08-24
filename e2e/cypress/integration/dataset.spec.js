describe('Harvest Dataset Validation', () => {
    
    before(() => {
        /**
         * Login as cypress user and create an organization for testing harvest source creation and running the jobs
         * Harvest data sets for validation
         */
         cy.login('cypress-user', 'cypress-user-password', false)
    })
    
    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })

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
        cy.get('a[href*="/dataset/"]').first().click();
        cy.get('a').should('contain', 'Download Metadata')
        cy.contains('Data.json Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').should('contain', 'public')
        cy.get('td').should('contain', '010:18')
        cy.get('span').should('contain', 'Fish and Wildlife Service')
    })

    it('waf dataset validation', () => {
        // Go to the harvest list, and select the first dataset
        cy.visit('/harvest/cypress-harvest-waf-iso');
        cy.get('a[href*="/dataset/"]').first().click();

        cy.get('a').should('contain', 'Download Metadata')
        cy.get('a[class="show-more"]').click()
        cy.get('td').contains('eng; USA')
        cy.get('td').contains('geospatial')
    })
})