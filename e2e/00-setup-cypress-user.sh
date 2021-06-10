# Setup the cypress user in CKAN for testing
paster --plugin=ckan user add cypress-user password=cypress-user-password email=test@doi.gov -c /srv/app/production.ini
paster --plugin=ckan sysadmin add cypress-user -c /srv/app/production.ini