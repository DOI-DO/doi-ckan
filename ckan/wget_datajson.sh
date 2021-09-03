#!/bin/bash


sleep 10
wget -qO /var/www/datajson/data.json localhost:8080/internal/data.json

curl localhost:8080/api/action/organization_list | \
jq -r '.result[]' | xargs -I'{}' \
wget -qO '/var/www/datajson/{}-data.json' 'localhost:8080/organization/{}/data.json'