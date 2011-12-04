ALTER TABLE profiles
ADD COLUMN password CHAR(40)
;

UPDATE profiles 
SET password = 'bd3027fa569ea15ca76d84db21c67e2d514c1a5a'
WHERE username = 'long'
;

UPDATE profiles 
SET password ='a93eb5dc54e7bbc6ff4d3ad1cbd94968862357ac' 
WHERE username = 'haruki'
;

UPDATE properties SET value = '6' WHERE name = 'version'
;
