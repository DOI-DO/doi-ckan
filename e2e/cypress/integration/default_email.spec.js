describe('Distribution and ContactPoints are correct', () => {
    const dcatUsOrg = 'dcat-us-org';
    const harvestSource = 'dcat-waf-iso';
    
    before(() => {
        //cy.login('admin', 'password', false);
        //cy.delete_organization(dcatUsOrg);
        //cy.create_dcat_org(dcatUsOrg, 'description', false);
        //cy.create_harvest_source();
    });

    beforeEach(() => {
       Cypress.Cookies.preserveOnce('auth_tkt', 'ckan'); 
    });

    after(() => {
       //cy.delete_harvest_source(harvestSource);
       //cy.delete_organization(dcatUsOrg);
       //cy.logout();
    });

    it('can validate default contact point fields and correct distribution fields', () => {
        //rewrite for just organization creation at harvester level
        //request data.json and check responses
        
        //cy.create_harvest_source('http://nginx-harvest-source/iso-waf/',
            //harvestSource,
            //'dcat waf iso',
            //'waf',
            //dcatUsOrg,
            //false,
            //false);
       //cy.start_harvest_job(harvestSource)
        cy.request('/data.json').then((response) => {
            expect(response.status).to.eq(200);
            const dcatUsObj = JSON.parse(response.body);
            const datasets = dcatUsObj['dataset'];
            cy.writeFile('/home/gil/dcat.json', `${dcatUsObj}`)
            cy.log(dcatUsObj)
            //harvest data
            //start harvest job should wait to finish for request
            datasets.forEach((dataset) => {
                cy.log(`${dataset['contactPoint']['hasEmail']}`)
                cy.wrap(`${dataset['contactPoint']['hasEmail']}`).should('eq', /^mailto:[\\w\\_\\~\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=\\:.-]+@[\\w.-]+\\.[\\w.-]+?$/gm); 
                cy.log(`${dataset['contactPoint']['fn']}`);
                const distribution = dataset['distribution'];
                if (distribution) {
                    distribution.forEach((distSet) => {
                        let urlField = distSet['accessURL'] ? distSet['accessURL'] : distSet['downloadURL']
                        cy.log(`${urlField}`)
                        
                    });
                }
            });
       }); 
    });
});
