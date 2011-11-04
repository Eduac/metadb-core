DROP TABLE IF EXISTS profiles
;

DROP TABLE IF EXISTS permissions
;

DROP TABLE IF EXISTS projects
;

DROP TABLE IF EXISTS features
;

DROP TABLE IF EXISTS controlled_vocabs
;

DROP TABLE IF EXISTS project_metadata
;

DROP TABLE IF EXISTS project_features
;

DROP TABLE IF EXISTS elements
;

DROP TABLE IF EXISTS settings
;

DROP TYPE IF EXISTS derivative
;

DROP TYPE IF EXISTS brand
;

DROP TABLE IF EXISTS items
;

DROP TABLE IF EXISTS item_data
;

DROP TABLE IF EXISTS properties
;

CREATE TABLE profiles (
	profile_id CHAR(36) NOT NULL PRIMARY KEY,
	username VARCHAR(30) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL UNIQUE,
	first_name VARCHAR(20) DEFAULT '',
	last_name VARCHAR(20) DEFAULT '',
	last_login BIGINT DEFAULT 0,
	last_project_id CHAR(36) DEFAULT NULL
)
;

/*
 Feature bit mask is the combinations of permissioned features for
 a project
 */
CREATE TABLE permissions (
	profile_id CHAR(36) NOT NULL,
	project_id CHAR(36) NOT NULL,
	feature_bit_mask BIGINT DEFAULT 0,
	UNIQUE (profile_id, project_id)
)
;

/*
 Features are entities that can be permissioned/entitled, for example
 admin, desc, controlled vocab, import, export
 */
CREATE TABLE features (
	feature_id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	description VARCHAR(100) DEFAULT '',
	feature_bit BIGINT NOT NULL UNIQUE
)
;

/*
 Only stores the required information for a project
 */
CREATE TABLE projects (
	project_id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(100) DEFAULT '',
	branding_text VARCHAR(255) DEFAULT ''
)
;

CREATE TABLE controlled_vocabs (
	vocab_id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(40) NOT NULL UNIQUE,
	words TEXT
)
;

CREATE TABLE project_features (
	project_id CHAR(36) NOT NULL,
	feature_id CHAR(36) NOT NULL,
	element_id CHAR(36) NOT NULL,
	value VARCHAR(40) NOT NULL DEFAULT '',
	setting_bit_mask BIGINT,
	vocab_id CHAR(36) NOT NULL
)
;
/*
 This table is setting for element.value pair such as static, large, controlled…
 */
CREATE TABLE settings (
	setting_id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(40) NOT NULL UNIQUE,
	bit BIGINT NOT NULL UNIQUE
)
;

CREATE TYPE derivative AS ENUM ('thumbnail', 'zoom', 'custom', 'full')
;

CREATE TYPE brand AS ENUM ('under', 'over', 'none')
;

CREATE TABLE derivatives (
	derivative_id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(40) NOT NULL UNIQUE
)
;

CREATE TABLE project_metadata (
	project_id CHAR(36) NOT NULL,
	derivative DERIVATIVE NOT NULL,
	width INT NOT NULL DEFAULT 0,
	height INT NOT NULL DEFAULT 0,
	brand BRAND NOT NULL,
	background_color CHAR(6) NOT NULL DEFAULT 'FFFFFF',
	foreground_color CHAR(6) NOT NULL DEFAULT '000000'
)
;

CREATE TABLE elements (
	element_id CHAR(36) NOT NULL PRIMARY KEY,
	standard VARCHAR(40) NOT NULL,
	element VARCHAR(40) NOT NULL,
	UNIQUE (standard, element)
)
;

CREATE TABLE items (
	item_id CHAR(36) NOT NULL PRIMARY KEY,
	project_id CHAR(36) NOT NULL,
	item_index INT NOT NULL,
	element_id CHAR(36) NOT NULL,
	value VARCHAR(40) NOT NULL
)
;

CREATE TABLE item_data (
	item_id CHAR(36) NOT NULL PRIMARY KEY,
	data TEXT DEFAULT ''
)
;

CREATE TABLE properties (
	name VARCHAR(50) NOT NULL PRIMARY KEY,
	value VARCHAR(50) NOT NULL DEFAULT ''
)
;

INSERT INTO properties (name, value) VALUES ('version', '1')
;