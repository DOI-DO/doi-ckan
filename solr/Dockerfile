FROM solr:8.11-slim

# Enviroment
ENV SOLR_CORE ckan
ENV SOLR_CONFIG_DIR="/opt/solr/server/solr/configsets"
ENV SOLR_SCHEMA_FILE="$SOLR_CONFIG_DIR/ckan/conf/managed-schema"
# Create Directories
USER root

RUN cp -R $SOLR_CONFIG_DIR/_default $SOLR_CONFIG_DIR/$SOLR_CORE

ADD https://raw.githubusercontent.com/ckan/ckan/dev-v2.9/ckan/config/solr/schema.xml $SOLR_SCHEMA_FILE

RUN chmod 644 $SOLR_SCHEMA_FILE 

USER solr

