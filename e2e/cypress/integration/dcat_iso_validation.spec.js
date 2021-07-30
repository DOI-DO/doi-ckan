function rtrim(x, characters) {
    var start = 0;
    var end = x.length - 1;
    while (characters.indexOf(x[end]) >= 0) {
      end -= 1;
    }
    return x.substr(0, end + 1);
}

describe('iso metadata validation in dcat-us file', () => {
    const harvestOrg = 'cypress-validation-org';
    const wafIsoHarvestSourceName = 'cypress-harvest-waf-iso';
    
    before(() => {
        cy.login('cypress-user', 'cypress-user-password', false);
        cy.delete_organization(harvestOrg);
        cy.create_organization(harvestOrg, 'cypress harvest org description', false);
        cy.create_harvest_source(
          "https://www.sciencebase.gov/data/lcc/south-atlantic/iso2/",
          wafIsoHarvestSourceName,
          "cypress test waf iso",
          "waf",
          harvestOrg,
          false,
          false
        );
        cy.start_harvest_job(wafIsoHarvestSourceName)
    });

    beforeEach(() => {
        /**
         * Preserve the cookies to stay logged in
         */
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    });

    after(() => {
        cy.delete_harvest_source(wafIsoHarvestSourceName);
        cy.delete_organization(harvestOrg);
    });

    it('should validate distribution field within each dataset', () => {
        cy.request('/cache_data.json').should((response) => {
            const dcatUsObj = response.body

            for (let i = 0; i < dcatUsObj["dataset"].length; i++) {

                let downloadURL =
                  dcatUsObj["dataset"][i]["distribution"][
                    dcatUsObj["dataset"][i]["distribution"].length - 1
                  ]['downloadURL'].replace('http://ckan-web:5000', '');
                
                let guid = dcatUsObj['dataset'][i]['identifier'];
                
                let titleURL = dcatUsObj["dataset"][i]["title"]
                  .split("(")
                  .join("")
                  .split(")")
                  .join("")
                  .split(":")
                  .join("")
                  .split(",")
                  .join("")
                  .split(".")
                  .join("-")
                  .split('’')
                  .join('')
                  .split('\'')
                  .join('')
                  .split(" ")
                  .join("-")
                  .slice(0, 95)
                  .toLowerCase();

                //this dataset was an edge case that couldn't be transformed like the other URLs
                if (titleURL == 'marsh-classification-vector-polygons-for-the-south-atlantic-landscape-conservation-cooperative-') {
                    titleURL = 'marsh-classification-vector-polygons-for-the-south-atlantic-landscape-conservation-coopera-2014';
                }

                cy.visit('/dataset/'+titleURL);
                cy.get('a[class="show-more"]').click();
                //cy.wrap((cy.get('td[class="dataset-details"').eq(2))).should('contain', guid)
                cy.get('td[class="dataset-details"').eq(2).then(($td) => {
                    cy.wrap($td.text().trim()).should('eq', `${guid}`)
                });

                cy.get('a[href="'+downloadURL+'"]').should('contain', 'Download Metadata');


            }
        });
    });

});