# FROM openknowledge/ckan-base:2.8 -- in future, may use this as well
FROM openknowledge/ckan-base:2.9

ARG APP_DIR=/srv/app
# specify the build arg (either development or prod)
ARG CKAN_ENV=PROD

ENV GIT_BRANCH=2.9

ENV SRC_EXTENSIONS_DIR=/srv/app/src_extensions
RUN chown ckan -R ${APP_DIR}

RUN apk add geos-dev proj proj-util proj-dev


COPY requirements.txt ${APP_DIR}/requirements.txt
RUN /usr/bin/python3 -m pip install --upgrade pip
# some errors installing cryptography with the ckan-base image see:
# https://github.com/geerlingguy/JJG-Ansible-Windows/issues/28#ref-commit-b854e7a
RUN apk add --no-cache libffi-dev openssl-dev python3-dev jq
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt --ignore-installed
COPY docker-entrypoint.d/* /docker-entrypoint.d/

COPY harvest-run-cron ${APP_DIR}
COPY datajson-wget-cron ${APP_DIR}
COPY start_ckan_web.sh ${APP_DIR}

COPY doi_prerun.py ${APP_DIR}

COPY start_ckan_worker.sh ${APP_DIR}

COPY supervisor.worker.conf /etc/supervisord.d/worker.conf

RUN ln -s /usr/bin/python3 /usr/bin/python

COPY create_datajson.sh ${APP_DIR}

COPY configs/export.map.json export.map.json

RUN apk update && apk add nginx
RUN adduser -D -g 'www' www && chown -R www:www /var/lib/nginx

RUN mkdir /var/www/datajson/ && chown -R www /var/www/datajson/

COPY nginx_ckan /etc/nginx/nginx.conf

# Dev additions
RUN if [ "${CKAN_ENV}" = "development" ]; then \
        apk add vim; \
        pip install --no-binary :all: -r https://raw.githubusercontent.com/ckan/ckan/${GIT_BRANCH}/dev-requirements.txt; \
        mkdir $SRC_EXTENSIONS_DIR; \
    fi

COPY start_ckan_web_dev.sh ${APP_DIR}