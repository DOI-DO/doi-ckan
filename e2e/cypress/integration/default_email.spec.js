describe('Distribution and ContactPoints are correct', () => {
    const dcatUsOrg = 'dcat-us-org';

    it('can validate default contact point fields and correct distribution fields', () => {
        let testDataset = '';
        cy.request('/data.json').should((response) => {
            expect(response.status).to.eq(200);
            const dcatUsObj = JSON.parse(response.body);
            const datasets = dcatUsObj['dataset'];
            cy.log(dcatUsObj)
            let validUrls = [];
            let invalidUrls = [];
            datasets.forEach((dataset) => {
                cy.log(`${dataset['contactPoint']['hasEmail']}`)
                if (dataset['title'] == 'EK500 Water Column Sonar Data Collected During AL0001') {
                    testDataset = dataset;
                } 
                cy.log(`${dataset['contactPoint']['fn']}`);
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
            //there is a URL in validURLs, such that url='http://invalidURL'. This is considered valid, but was meant to
            //be registered as invalid for testing
            expect(invalidUrls).to.have.lengthOf(4);
            expect(validUrls).to.have.lengthOf(16);
       // dataset page should have an invalid email for a dataset. dcat-us should have default email that is valid for
       // the same dataset
       cy.visit('http://localhost:5000/dataset/ek500-water-column-sonar-data-collected-during-al0001');
       cy.get('a[class="show-more"]').click();
       cy.get('a[href="mailto:invalid"]').should('contain', 'Unknown');
       cy.wrap(`${testDataset['contactPoint']['hasEmail']}`).should('eq', `mailto:jimmy_dean@${dcatUsOrg}.gov`);
       }); 
    });
});