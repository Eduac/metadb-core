/* 
Create metadata schema table. schema_id is UUID.
*/
CREATE TABLE metadata_schemas(
    schema_id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(36) NOT NULL UNIQUE,
    description VARCHAR(100) DEFAULT ''
)
;

INSERT INTO metadata_schemas VALUES('617ef9b0-3576-11e1-b86c-0800200c9a66', 'dublin', 'Dublin Core');

ALTER TABLE metadata_schemas 
OWNER TO metadb_rw
;

GRANT SELECT ON TABLE metadata_schemas TO metadb_ro
;

ALTER TABLE elements 
ALTER COLUMN standard TYPE char(36)
;

ALTER TABLE elements
RENAME COLUMN standard TO schema_id
;

UPDATE elements SET schema_id =(SELECT schema_id FROM metadata_schemas WHERE name = 'dublin');

ALTER TABLE elements ADD CONSTRAINT elements_schema_id_fk FOREIGN KEY (schema_id) REFERENCES metadata_schemas MATCH FULL ON DELETE CASCADE
;

UPDATE properties SET value = '8' WHERE name = 'version'
;
