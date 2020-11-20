#!/bin/bash

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
echo "Need to sleep before starting ckan workers. zzzz...."
sleep 60

# Start supervisor
if [ $? -eq 0 ]
    supervisord --configuration /etc/supervisord.conf &
else
  echo "[prerun] failed...not starting CKAN."
fi