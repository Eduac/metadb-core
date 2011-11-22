GRANT SELECT ON TABLE profiles TO metadb_ro
;

GRANT SELECT ON TABLE permissions TO metadb_ro
;

GRANT SELECT ON TABLE projects TO metadb_ro
;

GRANT SELECT ON TABLE features TO metadb_ro
;

GRANT SELECT ON TABLE controlled_vocabs TO metadb_ro
;

GRANT SELECT ON TABLE project_metadata TO metadb_ro
;

GRANT SELECT ON TABLE project_features TO metadb_ro
;

GRANT SELECT ON TABLE elements TO metadb_ro
;

GRANT SELECT ON TABLE settings TO metadb_ro
;

GRANT SELECT ON TABLE items TO metadb_ro
;

GRANT SELECT ON TABLE item_data TO metadb_ro
;

ALTER TABLE profiles OWNER TO metadb_rw
;

ALTER TABLE permissions OWNER TO metadb_rw
;

ALTER TABLE projects OWNER TO metadb_rw
;

ALTER TABLE features OWNER TO metadb_rw
;

ALTER TABLE controlled_vocabs OWNER TO metadb_rw
;

ALTER TABLE project_metadata OWNER TO metadb_rw
;

ALTER TABLE project_features OWNER TO metadb_rw
;

ALTER TABLE elements OWNER TO metadb_rw
;

ALTER TABLE settings OWNER TO metadb_rw
;

ALTER TABLE items OWNER TO metadb_rw
;

ALTER TABLE item_data OWNER TO metadb_rw
;

ALTER TABLE properties OWNER TO metadb_rw
;

UPDATE properties SET value = '2' WHERE name = 'version'
;
