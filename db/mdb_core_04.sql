INSERT INTO elements VALUES('c67ef610-080a-11e1-be50-0800200c9a66', 'dublin', 'contributor');
INSERT INTO elements VALUES('c67ef611-080a-11e1-be50-0800200c9a66', 'dublin', 'coverage');
INSERT INTO elements VALUES('c67ef612-080a-11e1-be50-0800200c9a66', 'dublin', 'creator');
INSERT INTO elements VALUES('c67ef613-080a-11e1-be50-0800200c9a66', 'dublin', 'date');
INSERT INTO elements VALUES('c67ef614-080a-11e1-be50-0800200c9a66', 'dublin', 'description');
INSERT INTO elements VALUES('c67ef615-080a-11e1-be50-0800200c9a66', 'dublin', 'format');
INSERT INTO elements VALUES('c67ef616-080a-11e1-be50-0800200c9a66', 'dublin', 'identifier');
INSERT INTO elements VALUES('c67ef617-080a-11e1-be50-0800200c9a66', 'dublin', 'language');
INSERT INTO elements VALUES('c67ef618-080a-11e1-be50-0800200c9a66', 'dublin', 'publisher');
INSERT INTO elements VALUES('c67ef619-080a-11e1-be50-0800200c9a66', 'dublin', 'relation');
INSERT INTO elements VALUES('c67ef61a-080a-11e1-be50-0800200c9a66', 'dublin', 'rights');
INSERT INTO elements VALUES('c67ef61b-080a-11e1-be50-0800200c9a66', 'dublin', 'source');
INSERT INTO elements VALUES('c67ef61c-080a-11e1-be50-0800200c9a66', 'dublin', 'subject');
INSERT INTO elements VALUES('c67ef61d-080a-11e1-be50-0800200c9a66', 'dublin', 'title');
INSERT INTO elements VALUES('c67ef61e-080a-11e1-be50-0800200c9a66', 'dublin', 'type');

DROP TYPE IF EXISTS role CASCADE
;

CREATE TYPE role AS ENUM ('admin', 'worker')
;

ALTER TABLE profiles ADD COLUMN role ROLE DEFAULT 'worker'
;

UPDATE properties SET value = '4' WHERE name = 'version'
;