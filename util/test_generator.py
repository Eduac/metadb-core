#!/usr/bin/env python
'''
====
MetaDB 4 Test Data Generator Script
Haruki Yamaguchi, Long Ho 
February 2012

Generates a .sql file with complete test data for MetaDB.

TODO: Add the masterfile/deriv dummy generation. This file currently only generates data for the database to import.

Input: None
Output: 1x .SQL file to tear down and setup the test harness

====
Steps for test data generation

1. Generate dummy IDs for permissions 
2. Generate dummy controlled vocabs
3. Generate test metadata schema
4. Generate features (admin/desc/tech) <--how to make system parse tech?
5. Generate projects
6. Generate project metadata
7. Generate project features
8. Generate test elements
9. Generate items
10. Generate permissions
11. Generate item data

=====
Dependency List (order in which tables must be populated with test data)
Any order will work within the dependency level.

NO DEPENDENCIES (Data in these tables will be explicitly torn down)
profiles (profile_id, username, email, first_name, last_name, last_login, last_project_id, role, password) 
controlled_vocabs (vocab_id, name, words)
metadata_schemas (schema_id, name, description) 
features (feature_id, name, description, feature_bit)
settings (setting_id, name, bit)
projects (project_id, name, description, branding_text)
properties (name, value)

elements (element_id, schema_id, element)
project_metadata (project_id, derivative, width, height, brand, background_color, foreground_color)
project_features (project_id, feature_id, element_id, value, setting_bit_mask, vocab_id)

items (item_id, project_id, item_index, element_id, value) depends on project_features
permissions (profile_id, project_id, feature_bit_mask)

THREE DEPENDENCIES
item_data (item_id, data) <indirectly depends on project/element>

'''

import csv
import random
import uuid
import hashlib 
import re
import string

def gen_delete_query (table, idField, idVal):
	return "DELETE FROM "+table+" WHERE "+idField+'= \''+idVal+'\';'

'''
Generates a insert query for table. Assume var and vals match up together (ignore the ID column)
'''
def gen_insert_query (table, ids, columns, vals_format, vals):
	result={}
	result['ids'] = ids
	query = "INSERT INTO "+table+"("
	query+= ', '.join(map(str, columns))
	query+= ") "
	query+= "VALUES (" 
	valList = []
	for val in vals:
		if val=='null' or val=='NULL':
			valList.append('null')
		elif isinstance(val, int):
			valList.append(str(val))
		else:
			valList.append('\''+val+'\'')
	query+= ", ".join(valList)
	query+= ");" 
	result['query'] = query
	return result
''' By table
'''
def gen_create_profile (user):
  table = 'profiles'
  ids = {}
  ids['profile_id'] = user ['profile_id'] 
  columns = ['profile_id', 'username', 'email', 'first_name', 'last_name', 'last_login', 'last_project_id', 'role', 'password'] 
  vals_format = ['\'%s\'', '\'%s\'',  '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [user['profile_id'], user['username'], user['email'], user['first_name'], user['last_name'], user['last_login'], user['last_project_id'], user['role'], user['password']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_vocab (vocab):
  table = 'controlled_vocabs'
  ids = {}
  ids['vocab_id'] = vocab['vocab_id'] 
  columns = ['vocab_id', 'name', 'words']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [vocab['vocab_id'], vocab['name'], vocab['words']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_schema (schema):
  table = 'metadata_schemas'
  ids = {}
  ids['schema_id'] = schema['schema_id'] 
  columns = ['schema_id', 'name', 'description']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [schema['schema_id'], schema['name'], schema['description']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_feature (feature): 
  table = 'features'
  ids = {}
  ids['feature_id'] = feature['feature_id'] 
  columns = ['feature_id', 'name', 'description', 'feature_bit']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [feature['feature_id'], feature['name'], feature['description'], feature['feature_bit']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_setting (setting):
  table = 'settings'
  ids = {}
  ids['setting_id'] = setting['setting_id'] 
  columns = ['setting_id', 'name' 'bit']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [setting['setting_id'], setting['name'], setting['bit']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_element (element):
	table = 'elements'
	ids = {}
	ids['schema_id'] = element['schema_id']
	ids['element_id'] = element['element_id']
	columns = ['element_id', 'schema_id', 'element']
	vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
	vals = [element['element_id'], element['schema_id'], element['element']]
	result = gen_insert_query (table, ids, columns, vals_format, vals)
	return result

def gen_create_project (project):
	table = 'projects'
	ids = {}
	ids['project_id'] = project['project_id'] 
	columns = ['project_id', 'name', 'description', 'branding_text']
	vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
	vals = [project['project_id'], project['name'], project['description'], project['branding_text']]
	result = gen_insert_query (table, ids, columns, vals_format, vals)
	return result

def gen_create_property (prop):
	table = 'properties'
	ids = {}
	columns = ['name', 'value']
	vals_format = ['\'%s\'', '\'%s\'']
	vals = [prop['name'], prop['value']]
	result = gen_insert_query (table, ids, columns, vals_format, vals)
	return result

def gen_create_item_data ( item_data):
  table = 'item_data'
  ids = {}
  ids['item_id'] = item_data['item_id']
  columns = ['item_id', 'data']
  vals_format = ['\'%s\'', '\'%s\'']
  vals = [item_data['item_id'], item_data['data']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_project_metadata (project_md):
  table = 'project_metadata'
  ids = {}
  ids['project_id'] = project_md['project_id'] 
  columns = ['project_id', 'derivative', 'width', 'height', 'brand', 'background_color', 'foreground_color']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [project_md['project_id'], project_md['derivative'], project_md['width'], project_md['height'], project_md['brand'], project_md['background_color'], project_md['foreground_color']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_item (item):
  table = 'items'
  ids = {}
  ids['item_id'] = item['item_id'] 
  ids['project_id'] = item['project_id']
  columns = ['item_id', 'project_id', 'item_index', 'element_id', 'value']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\''] 
  vals = [item['item_id'], item['project_id'], item['item_index'], item['element_id'], item['value']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_permission (permission):
  table = 'permissions'
  ids = {}
  ids['profile_id'] = permission['profile_id'] 
  ids['project_id'] = permission['project_id'] 
  columns = ['profile_id', 'project_id', 'feature_bit_mask']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [permission['profile_id'], permission['project_id'], permission['feature_bit_mask']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_project_feature (project_feature):
  table = 'project_features'
  ids = {}
  ids['project_id'] = project_feature['project_id']
  ids['feature_id'] = project_feature['feature_id']
  ids['element_id'] = project_feature['element_id']
  ids['vocab_id'] = project_feature['vocab_id']
  columns = ['project_id', 'feature_id', 'element_id', 'value', 'setting_bit_mask', 'vocab_id']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\''] 
  vals = [project_feature['project_id'], project_feature['feature_id'], project_feature['element_id'], project_feature['value'], project_feature['setting_bit_mask'], project_feature['vocab_id']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def lorem_ipsum (amount):
	text = """Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Integer
	eu lacus accumsan arcu fermentum euismod. Donec pulvinar porttitor
	tellus. Aliquam venenatis. Donec facilisis pharetra tortor.  In nec
	mauris eget magna consequat convallis. Nam sed sem vitae odio
	pellentesque interdum. Sed consequat viverra nisl. Suspendisse arcu
	metus, blandit quis, rhoncus ac, pharetra eget, velit. Mauris
	urna. Morbi nonummy molestie orci. Praesent nisi elit, fringilla ac,
	suscipit non, tristique vel, mauris. Curabitur vel lorem id nisl porta
	adipiscing. Suspendisse eu lectus. In nunc. Duis vulputate tristique
	enim. Donec quis lectus a justo imperdiet tempus."""
	words= text.split()
	return " ".join(words[0:max(len(words), amount)])

profiles = []
userNames=  [ 'lacus', 'kira', 'athrun', 'cagalli', 'mu']
firstNames = [ 'Lacus', 'Kira', 'Athrun', 'Cagalli', 'Mu' ]
emails = [ 'lc@gundam.com', 'ky@gundam.com', 'az@gundam.com', 'cy@gundam.com', 'ml@gundam.com' ]
lastNames = [ 'Clyne', 'Yamato', 'Zala', 'Yula Athha', 'La Flaga']
password = '123123'

numProfiles = len(userNames)

for i in range(numProfiles):
	profile = {}
	profile['profile_id'] = uuid.uuid4().hex
	profile['username'] = userNames[i]
	profile['email'] = emails[i]
	profile['first_name'] = firstNames[i]
	profile['last_name'] = lastNames[i]
	profile['last_login'] = 0
	profile['last_project_id'] = 'null'
	profile['role'] = 'worker'
	sha = hashlib.sha1()
	sha.update('789789')
	profile['password'] = sha.hexdigest()
	profiles.append(profile)


### 
# Generate Vocabs
###
numVocabs = 5
vocabs = []
for i in range(numVocabs):
	vocabs.append( { 'vocab_id' : uuid.uuid4().hex, 
									 'name' :'vocab_'+str(i),
									 'words' : ", ".join(list("".join(list([random.choice(string.letters) for i in xrange(8)])) for j in xrange(10))) })

###
# Generate projects
###
numProjects = 5
projects=[]
for i in range(numProjects):
	projects.append( 
		{ 
			'project_id' : uuid.uuid4().hex, 
			'name' : 'project_'+str(i),
			'description' : 'Test description for project_'+str(i),
			'branding_text' : 'Test brand for project_'+str(i)
		})

metadata_schemas = []
metadata_schemas.append(
		{ 
			'schema_id' : uuid.uuid4().hex,
			'name' : 'test_schema',
			'description' : 'Test schema.'
		})

features = []
features.append(
		{ 
			'feature_id' : uuid.uuid4().hex,
			'name' : 'descriptive',
			'description' : 'Descriptive metadta',
			'feature_bit' : 100
		})

features.append(
		{ 
			'feature_id' : uuid.uuid4().hex,
			'name' : 'administrative',
			'description' : 'Administrative metadta',
			'feature_bit' : 101
		})

elements = []
for schema in metadata_schemas:
	for i in range(10):
		elements.append(
				{
					'element_id' : uuid.uuid4().hex,
					'schema_id' : schema['schema_id'],
					'element' : schema['name']+'_element_'+str(i)
				})
###
# Bad code here. element_id is fine but value is always hardcoded
project_features = []
for project in projects:
	eleIndex = 0
	for feature in features:
		numElements = len(elements)
		for element in elements:
			project_features.append(
					{
						'project_id' : project['project_id'],
						'feature_id' : feature['feature_id'],
						'element_id' : element['element_id'],
						'value' : 'value_'+str(eleIndex),
						'setting_bit_mask' : 0,
						'vocab_id' : 'null'
					})
			eleIndex+=1

items = []
for project_feature in project_features:
		for i in range(10):
				items.append(
					{
						'item_id' : uuid.uuid4().hex,
						'project_id' : project['project_id'],
						'item_index' : i,
						'element_id' : project_feature['element_id'],
						'value' : project_feature['value'] 
					})

item_data = []
for item in items:
	item_data.append(
			{
				'item_id' : item['item_id'],
				'data' : lorem_ipsum(random.randint(1, 20))
			})

permissions = []
for profile in profiles:
	for project in projects:
		permissions.append(
				{
					'profile_id' : profile['profile_id'],
					'project_id' : project['project_id'],
					'feature_bit_mask' : '00'
				})

project_metadata = []
for project in projects: 
	project_metadata.append(
			{
				'project_id' : project['project_id'],
				'derivative' : 'zoom',
				'width' : 2000,
				'height' : 2000,
				'brand' : 'none',
				'background_color' : '000000',
				'foreground_color' : 'ffffff'
			})
	
	project_metadata.append(
			{
				'project_id' : project['project_id'],
				'derivative' : 'full',
				'width' : 0,
				'height' : 0,
				'brand' : 'none',
				'background_color' : '000000',
				'foreground_color' : 'ffffff'
			})
	
	project_metadata.append(
			{
				'project_id' : project['project_id'],
				'derivative' : 'custom',
				'width' : 800,
				'height' : 800,
				'brand' : 'none',
				'background_color' : '000000',
				'foreground_color' : 'ffffff'
			})
	
	project_metadata.append(
			{
				'project_id' : project['project_id'],
				'derivative' : 'thumbnail',
				'width' : 300,
				'height' : 300,
				'brand' : 'none',
				'background_color' : '000000',
				'foreground_color' : 'ffffff'
			})
	


createCommands=[]

for profile in profiles:
	createCommands.append(gen_create_profile(profile))

for vocab in vocabs:
	createCommands.append(gen_create_vocab(vocab))

for schema in metadata_schemas:
	createCommands.append(gen_create_schema(schema))

for feature in features:
	createCommands.append(gen_create_feature(feature))

for project in projects:
	createCommands.append(gen_create_project(project))

for element in elements:
	createCommands.append(gen_create_element(element))

for metadata in project_metadata:
	createCommands.append(gen_create_project_metadata(metadata))

for pj_feature in project_features:
	createCommands.append(gen_create_project_feature(pj_feature))

for item in items:
	createCommands.append(gen_create_item(item))

for permission in permissions:
	createCommands.append(gen_create_permission(permission))

for data in item_data:
	createCommands.append(gen_create_item_data(data))


removeCommands = []
for profile in profiles:
	removeCommands.append(gen_delete_query('profiles', 'profile_id', profile['profile_id']))

for vocab in vocabs:
	removeCommands.append(gen_delete_query('controlled_vocabs', 'vocab_id', vocab['vocab_id']))

for schema in metadata_schemas:
	removeCommands.append(gen_delete_query('metadata_schemas', 'schema_id', schema['schema_id']))

for feature in features:
	removeCommands.append(gen_delete_query('features', 'feature_id', feature['feature_id']))

for project in projects: 
	removeCommands.append(gen_delete_query('projects', 'project_id', project['project_id']))

outputFile = open("test_data.sql", "w")
for command in removeCommands:
	outputFile.write(command+'\n')

for i in range(3):
	outputFile.write('\n')

for command in createCommands:
	outputFile.write(command['query']+'\n')
outputFile.close()