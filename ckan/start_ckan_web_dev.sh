#!/bin/bash

# Install any local extensions in the src_extensions volume
echo "Looking for local extensions to install..."
echo "Extension dir contents:"
ls -la $SRC_EXTENSIONS_DIR
for i in $SRC_EXTENSIONS_DIR/*
do
    if [ -d $i ];
    then

        if [ -f $i/setup.py ];
        then
            cd $i
            # Uninstall any current implementation of the code
            echo uninstalling "${PWD##*/}"
            pip3 uninstall "${PWD##*/}"
            # Install the extension in editable mode
            pip3 install -e .
            echo "Found setup.py file in $i"
            cd $APP_DIR
        fi

        # Point `use` in test.ini to location of `test-core.ini`
        if [ -f $i/test.ini ];
        then
            echo "Updating \`test.ini\` reference to \`test-core.ini\` for plugin $i"
            ckan config-tool $i/test.ini "use = config:../../src/ckan/test-core.ini"
        fi

        # Add configuration file to testing data json extension if applicable
        if [ $i = 'ckanext-datajson' ];
        then
            # Add configuration file
            echo "Copying datajson configuration export map to development space"
            cp export.map.json $i/ckanext-datajson/ckanext/datajson/export_map/export.map.json
        fi
    fi
done

# Copy export.map for ckanext-datajson
if [ -d "src/ckanext-datajson" ];
then
    cp export.map.json src/ckanext-datajson/ckanext/datajson/export_map/export.map.json
fi

# Set debug to true
echo "Enabling debug mode"
ckan config-tool $CKAN_INI -s DEFAULT "debug = true"
# Update the plugins setting in the ini file with the values defined in the env var
echo "Loading the following plugins: $CKAN__PLUGINS"
ckan config-tool $CKAN_INI "ckan.plugins = $CKAN__PLUGINS"


# Update test-core.ini DB, SOLR & Redis settings
echo "Loading test settings into test-core.ini"
ckan config-tool $SRC_DIR/ckan/test-core.ini \
    "sqlalchemy.url = $TEST_CKAN_SQLALCHEMY_URL" \
    "ckan.datastore.write_url = $TEST_CKAN_DATASTORE_WRITE_URL" \
    "ckan.datastore.read_url = $TEST_CKAN_DATASTORE_READ_URL" \
    "solr_url = $TEST_CKAN_SOLR_URL" \
    "ckan.redis.url = $TEST_CKAN_REDIS_URL"

# Update the theme for DOI
ckan config-tool $CKAN_INI \
    "ckan.site_title = $CKAN__SITE_TITLE" \
    "ckan.site_description = $CKAN__SITE_DESCRIPTION" \
    "ckan.site_intro_text = $CKAN__SITE_INTRO_TEXT" \
    "ckan.site_logo = $CKAN__SITE_LOGO" \
    "ckan.site_about = $CKAN__SITE_ABOUT" \

# Run the prerun script to init CKAN and create the default admin user
sudo -u ckan -EH python prerun.py

# Run any startup scripts provided by images extending this one
if [[ -d "/docker-entrypoint.d" ]]
then
    for f in /docker-entrypoint.d/*; do
        case "$f" in
            *.sh)     echo "$0: Running init file $f"; . "$f" ;;
            *.py)     echo "$0: Running init file $f"; python "$f"; echo ;;
            *)        echo "$0: Ignoring $f (not an sh or py file)" ;;
        esac
        echo
    done
fi

echo "serving"
sudo -u ckan -EH ckan serve --reload $CKAN_INI
