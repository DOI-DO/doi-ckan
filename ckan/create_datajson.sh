#!/bin/bash


sleep 10
curl localhost:5001/internal/data.json --output /var/www/datajson/data.json --connect-timeout 15000 -m 15000

curl localhost:5001/api/action/organization_list | \
jq -r '.result[]' | xargs -I'{}' \
curl 'localhost:5001/organization/{}/data.json' --output '/var/www/datajson/{}-data.json' --connect-timeout 15000 -m 15000