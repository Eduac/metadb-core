/* 
Drop the NOT NULL for vocab_id. Impossible to insert anything with a blank vocab at the moment due to foreign key dependency.  
 */
ALTER TABLE project_features ALTER COLUMN vocab_id DROP NOT NULL
;

UPDATE properties SET value = '9' WHERE name = 'version'
;
