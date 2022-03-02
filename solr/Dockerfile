FROM solr:8.11-slim
USER root

# Enviroment
ENV SOLR_CORE ckan

# Create Directories
RUN mkdir -p /opt/solr
RUN mkdir -p /opt/solr/server
RUN mkdir -p /opt/solr/server/solr/configsets/_default/conf
# RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/conf
RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/data
RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/data/index


# Add files
ADD solrconfig.xml \
schema.xml \
# https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/currency.xml \
# https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/synonyms.txt \
# https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/stopwords.txt \
# https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/basic_configs/conf/protwords.txt \
# https://raw.githubusercontent.com/apache/lucene-solr/releases/lucene-solr/6.6.2/solr/server/solr/configsets/data_driven_schema_configs/conf/elevate.xml \
/opt/solr/server/solr/conf/

# Create Core.properties
RUN echo name=$SOLR_CORE > /opt/solr/server/solr/$SOLR_CORE/core.properties

# Giving ownership to Solr
RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/

RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE
RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE/data
RUN chown -R $SOLR_USER:$SOLR_USER /opt/solr/server/solr/$SOLR_CORE/data/index
# User
USER $SOLR_USER:$SOLR_USER
