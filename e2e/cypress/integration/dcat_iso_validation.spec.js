
describe('iso metadata validation in dcat-us file', () => {
    const harvestOrg = 'cypress-validation-org';
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso';

    it('should validate distribution field within each dataset', () => {
        cy.request('/data.json').should((response) => {
            const dcatUsObj = response.body

            let dcatUsObjMap = {};

            for (let dataset of dcatUsObj['dataset']) {
                try {
                    // Get last distribution; for iso should be ckan download link
                    const downloadURL = dataset["distribution"][dataset["distribution"].length - 1]['downloadURL'];
                    let guid = dataset['identifier'];

                    if(downloadURL) {
                        dcatUsObjMap[guid] = downloadURL.replace('http://ckan-web:5000', '').replace('http://localhost:5000', '');
                    } else {
                        // Must be a data json source
                        dcatUsObjMap[guid] = null;
                    }
                } catch(e) {
                    cy.log('there was an error:');
                    cy.log(e);
                    cy.log(dataset["distribution"], dataset["distribution"].slice(-1)[0]);
                }
            }
            // Use function to validate, as called multiple times
            const validate_guid = function(guid) {
                expect(dcatUsObjMap[guid]).to.not.be.undefined;
                // Validate that the url is the same as the download metadata link
                cy.get(`a[href="${dcatUsObjMap[guid]}"]`).should('contain', 'Download Metadata');
            }

            // Get all ISO harvest source datasets
            cy.request('/api/action/package_search?q=harvest_source_title:cypress-harvest-waf-iso&rows=1000').then((response) => {
                // Visit each dataset page
                for( let dataset of response.body.result.results) {
                    cy.visit('/dataset/'+dataset.name);
                    cy.get('a[class="show-more"]').click();
                    // Get the GUID element value, check 0, 1, & 2 (normally 1)
                    cy.get('td[class="dataset-details"').eq(1).then(($td) => {
                        const guid = $td.text().trim();
                        //If it doesn't exist, try a different array element
                        if(!dcatUsObjMap[guid]) {
                            cy.get('td[class="dataset-details"').eq(0).then(($td) => {
                                const guid = $td.text().trim();
                                if(!dcatUsObjMap[guid]) {
                                    cy.get('td[class="dataset-details"').eq(2).then(($td) => {
                                        const guid = $td.text().trim();
                                        validate_guid(guid);
                                    });
                                } else {
                                    validate_guid(guid);
                                }
                            });
                        } else {
                            validate_guid(guid);
                        }
                    });
                }
            }) 
        });
    });
});