/* 
Create sessions table. session ID is UUID
*/
CREATE TABLE sessions (
    session_id CHAR(36) NOT NULL PRIMARY KEY,
    profile_id CHAR(36) NOT NULL,
    expire_time BIGINT NOT NULL DEFAULT 0
)
;

ALTER TABLE sessions 
OWNER TO metadb_rw,
ADD CONSTRAINT sessions_username_fk FOREIGN KEY (profile_id) REFERENCES profiles MATCH FULL ON DELETE CASCADE 
;

GRANT SELECT ON TABLE sessions TO metadb_ro
;


UPDATE properties SET value = '7' WHERE name = 'version'
;
