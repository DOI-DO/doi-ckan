#!/bin/bash


sleep 10
curl localhost:5001/internal/data.json --output /var/www/datajson/data.json --connect-timeout 10000 -m 10000

curl localhost:5001/api/action/organization_list | \
jq -r '.result[]' | xargs -I'{}' \
curl 'localhost:5001/organization/{}/data.json' --output '/var/www/datajson/{}-data.json' --connect-timeout 10000 -m 10000