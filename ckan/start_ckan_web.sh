#!/bin/bash

# Set debug to false
echo "Disabling debug mode"
paster --plugin=ckan config-tool $CKAN_INI -s DEFAULT "debug = false"

# Update the plugins setting in the ini file with the values defined in the env var
echo "Loading the following plugins: $CKAN__PLUGINS"
paster --plugin=ckan config-tool $CKAN_INI "ckan.plugins = $CKAN__PLUGINS"


# Lock down user view/create & set timeout to 12 hours
echo "Loading test settings into our ini file"
paster --plugin=ckan config-tool $CKAN_INI \
    "ckan.auth.public_user_details = false" \
    "ckan.auth.create_user_via_web = false" \
    "who.timeout = 43200"

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

# Set the common uwsgi options
UWSGI_OPTS="--plugins http,python,gevent --socket /tmp/uwsgi.sock --uid 92 --gid 92 --http :8080 --master --enable-threads --paste config:/srv/app/production.ini --paste-logger --lazy-apps --gevent 2000 -p 2 -L -b 32768"
cp /srv/app/datajson-wget-cron /etc/crontabs/root
chown root:root /etc/crontabs/root && /usr/sbin/crond -f & 
# Start uwsgi
sudo -u ckan -EH uwsgi $UWSGI_OPTS &
nginx -g 'daemon off;'

# supervisord --configuration /etc/supervisord.conf
echo "Need to sleep before starting. zzzz...."
sleep 60
