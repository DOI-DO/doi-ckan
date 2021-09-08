#!/bin/bash


sleep 10
wget -qO /var/www/datajson/data.json localhost:5001/internal/data.json

curl localhost:5001/api/action/organization_list | \
jq -r '.result[]' | xargs -I'{}' \
wget -qO '/var/www/datajson/{}-data.json' 'localhost:5001/organization/{}/data.json'