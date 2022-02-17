#!/bin/bash

# Set debug to false
# chown ckan -R /srv/app
# chown root -R /var/lib/ckan
# chown root -R /usr/lib/python3.8
# chown root -R /srv/app
# chown root -R /srv/app/./wsgi.py
# chown root -R /usr/sbin
mkdir /var/lib/ckan/webassets
echo "Disabling debug mode"

ckan config-tool $CKAN_INI -s DEFAULT "debug = false"

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
            cp export.map.json $i/ckanext/datajson/export_map/export.map.json
        fi
    fi
done

# Copy export.map for ckanext-datajson
if [ -d "src/ckanext-datajson" ];
then
    cp export.map.json src/ckanext-datajson/ckanext/datajson/export_map/export.map.json
fi

# Update the plugins setting in the ini file with the values defined in the env var
echo "Loading the following plugins: $CKAN__PLUGINS"
ckan config-tool $CKAN_INI "ckan.plugins = $CKAN__PLUGINS"


# Lock down user view/create & set timeout to 12 hours
echo "Loading test settings into our ini file"
ckan config-tool $CKAN_INI \
    "ckan.auth.public_user_details = false" \
    "ckan.auth.create_user_via_web = false" \
    # "ckan.devserver.host = " \
    # "ckan.devserver.port = 5005" \
    "who.timeout = 43200"

# Run the prerun script to init CKAN and create the default admin user
# sleep 1000
# python prerun.py
# sleep 1000
python doi_prerun.py
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

# Run datajson creation every minute for testing
if [ ${RAPID_TEST} = "1" ] ; then
  sed -i 's/10 2 \* \* \*/*\/1 * * * */g' /srv/app/datajson-wget-cron;
fi
cp /srv/app/datajson-wget-cron /etc/crontabs/root
chown root:root /etc/crontabs/root && /usr/sbin/crond -f & 

# Seed datajson files
./create_datajson.sh &

# Set the common uwsgi options
UWSGI_OPTS="--plugins http,python \
            --socket /tmp/uwsgi.sock \
            --wsgi-file /srv/app/wsgi.py \
            --module wsgi:application \
            --uid 92 --gid 92 \
            --http 0.0.0.0:5001 \
            --master --enable-threads \
            --lazy-apps \
            -p 2 -L -b 32768 --vacuum \
            --harakiri $UWSGI_HARAKIRI"
# Start uwsgi
uwsgi $UWSGI_OPTS &
nginx -g 'daemon off;'

# supervisord --configuration /etc/supervisord.conf
echo "Need to sleep before starting. zzzz...."
sleep 60
