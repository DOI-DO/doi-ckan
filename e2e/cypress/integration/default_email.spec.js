describe('Distribution and ContactPoints are correct', () => {
    const dcatUsOrg = 'dcat-us-org';

    it('can validate default contact point fields and correct distribution fields', () => {
        let testDataset = '';
        cy.request('/data.json').should((response) => {
            expect(response.status).to.eq(200);
            const dcatUsObj = JSON.parse(response.body);
            const datasets = JSON.parse(dcatUsObj['dataset']);
            cy.log('dcat-us object: ' + dcatUsObj)
            let validUrls = [];
            let invalidUrls = [];
            datasets.forEach((dataset) => {
                cy.log(`contactPont hasEmail: ${dataset['contactPoint']['hasEmail']}`)
                if (dataset['title'] == 'EK500 Water Column Sonar Data Collected During AL0001') {
                    testDataset = dataset;
                } 
                cy.log(`contactPoint fn: ${dataset['contactPoint']['fn']}`);
                const distribution = dataset['distribution'];
                if (distribution) {
                    distribution.forEach((distSet) => {
                        let urlField = distSet['accessURL'] ? distSet['accessURL'] : distSet['downloadURL']
                        cy.log(`${urlField}`)
                        try {
                            validUrls.push(new URL(urlField));
                        } catch (_) {
                            invalidUrls.push(urlField);
                        }
                    });
                }
            });
            //there should be no invalid urls because they would have been removed
            expect(invalidUrls).to.have.lengthOf(0);
            expect(validUrls).to.have.lengthOf(16);
       // dataset page should have an invalid email for a dataset. dcat-us should have default email that is valid for
       // the same dataset
       cy.visit('/dataset/ek500-water-column-sonar-data-collected-during-al0001');
       cy.get('a[class="show-more"]').click();
       cy.get('a[href="mailto:invalid"]').should('contain', 'Unknown');
       cy.wrap(`${testDataset['contactPoint']['hasEmail']}`).should('eq', `mailto:jimmy_dean@${dcatUsOrg}.gov`);
       }); 
    });

    it('can verify data.json is not empty without default emails', () => {
        cy.request('/data.json').should((response) => {
            expect(response.status).to.eq(200);
            const dcatUsObj = response.body;
            const datasets = dcatUsObj['dataset'];
            cy.wrap(datasets.length).should('be.gte', 1); 
       });
    });

    it('can validate that urls with invalid characters are not in the data.json distribution field', () => {
        cy.request('/data.json').should((response) => {
            expect(response.status).to.eq(200);
            const dcatUsObj = response.body;
            const datasets = dcatUsObj['dataset'];
            datasets.forEach((dataset) => {
                expect(dataset['title']).to.not.have.string('Gulf');    
            });
        });
    });
});
