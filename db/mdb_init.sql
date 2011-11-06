DROP USER IF EXISTS metadb_ro
;

CREATE USER metadb_ro
;

DROP USER IF EXISTS metadb_rw
;

CREATE USER metadb_rw
;

ALTER USER metadb_ro WITH PASSWORD 'metadb'
;

ALTER USER metadb_rw WITH PASSWORD 'metadb'
;

DROP DATABASE IF EXISTS metadb
;

CREATE DATABASE metadb WITH OWNER metadb_rw
;

GRANT CONNECT ON DATABASE metadb TO metadb_ro
;
