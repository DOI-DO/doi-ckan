FROM ckan/ckan-solr:2.9-solr8

USER root

ENV SOLR_CONFIG_DIR="/opt/solr/server/solr/configsets"
ENV SOLR_SCHEMA_FILE="$SOLR_CONFIG_DIR/ckan/conf/managed-schema"

ADD managed-schema $SOLR_SHEMA_FILE

RUN sed -i "s/<defaultSearchField>text<\/defaultSearchField>/<df>text<\/df>/" $SOLR_SCHEMA_FILE
RUN sed -i "s/<solrQueryParser defaultOperator=\"AND\"\/>/<solrQueryParser q.op=\"AND\"\/>/" $SOLR_SCHEMA_FILE



USER solr