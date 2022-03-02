FROM solr:8.11-slim

# Enviroment
ENV SOLR_CORE ckan
ENV SOLR_CONFIG_DIR="/opt/solr/server/solr/configsets"
ENV SOLR_SCHEMA_FILE="$SOLR_CONFIG_DIR/ckan/conf/managed-schema"
# Create Directories
USER root

# RUN mkdir -p /opt/solr
# RUN mkdir -p /opt/solr/server
# RUN mkdir -p /opt/solr/server/solr/configsets/_default/conf
# # RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/conf
# RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/data
# RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/data/index

RUN cp -R $SOLR_CONFIG_DIR/_default $SOLR_CONFIG_DIR/$SOLR_CORE

ADD https://raw.githubusercontent.com/ckan/ckan/dev-v2.9/ckan/config/solr/schema.xml $SOLR_SCHEMA_FILE
# RUN sed -i "s/<defaultSearchField>text<\/defaultSearchField>/<df>text<\/df>/" $SOLR_SCHEMA_FILE
# RUN sed -i "s/<solrQueryParser defaultOperator=\"AND\"\/>/<solrQueryParser q.op=\"AND\"\/>/" $SOLR_SCHEMA_FILE  
RUN chmod 644 $SOLR_SCHEMA_FILE 

USER solr
# Add files
# ADD solrconfig.xml \
# managed-schema \
# # https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/currency.xml \
# # https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/synonyms.txt \
# # https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/stopwords.txt \
# # https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/protwords.txt \
# # https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/data_driven_schema_configs/conf/elevate.xml \
# /opt/solr/server/solr/conf/

# # Create Core.properties
# RUN echo name=$SOLR_CORE > /opt/solr/server/solr/$SOLR_CORE/core.properties

# # Giving ownership to Solr
# RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/

# RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE
# RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE/data
# RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE/data/index
# # User
# USER $SOLR_USER:$SOLR_USER
