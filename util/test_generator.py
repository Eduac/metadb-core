#!/usr/bin/env python
'''
MetaDB 4 Test Data Generator Script
Haruki Yamaguchi, Long Ho 
February 2012

Input: Minimal. Takes target location of dummy master files 
Output: 1x .SQL file containing queries to create the test harness 
        1x .SQL file to tear down the test harness
'''

'''
Python modules/functionality needed

--random word generator (for random vocabs)
--random color generator (for dummy images)
--uuid generator

--

'''


'''
Dependency List (order in which tables must be populated with test data)

NO DEPENDENCIES
profiles (profile_id, username, email, first_name, last_name, last_login, last_project_id, role, password) 
controlled_vocabs (vocab_id, name, words)
metadata_schemas (schema_id, name, description) 
features (feature_id, name, description, feature_bit)
settings (setting_id, name, bit)
projects (project_id, name, description, branding_text)
properties (name, value)

ONE DEPENDENCY
elements (element_id, schema_id, element)
item_data (item_id, data)
project_metadata (project_id, derivative, width, height, brand, background_color, foreground_color)

TWO DEPENDENCIES
items (item_id, project_id, item_index, element_id, value)
permissions (profile_id, project_id, feature_bit_mask)

FOUR DEPENDENCIES
project_features (project_id, feature_id, element_id, value, setting_bit_mask, vocab_id)
'''

import csv
import random
import uuid
import sha
import re

PROJECT_COUNT=5
FEATURE_COUNT=3
ITEM_COUNT=100

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
  query+= ', '.join(map(str, vals_format)) % tuple(vals) 
  query+= ")" 

  result['query'] = query
  return result

'''
By table
'''
def gen_create_profile (user):
  table = 'profiles'
  ids = {}
  ids['profile_id'] = uuid.uuid4().hex
  columns = ['profile_id', 'username', 'email', 'first_name', 'last_name', 'last_login', 'last_project_id', 'role', 'password'] 
  vals_format = ['\'%s\'', '\'%s\'',  '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['profile_id'], user['username'], user['email'], user['first_name'], user['last_name'], user['last_login'], user['last_project_id'], user['role'], user['password']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_vocab (vocab):
  table = 'controlled_vocabs'
  ids = {}
  ids['vocab_id'] = uuid.uuid4().hex
  columns = ['vocab_id', 'name', 'words']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['vocab_id'], vocab['name'], vocab['words']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_schema (schema):
  table = 'metadata_schemas'
  ids = {}
  ids['schema_id'] = uuid.uuid4().hex
  columns = ['schema_id', 'name', 'description']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['schema_id'], schema['name'], schema['description']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_feature (feature): 
  table = 'features'
  ids = {}
  ids['feature_id'] = uuid.uuid4().hex
  columns = ['feature_id', 'name', 'description', 'feature_bit']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['feature_id'], feature['name'], feature['description'], feature['feature_bit']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_setting (setting):
  table = 'settings'
  ids = {}
  ids['setting_id'] = uuid.uuid4().hex
  columns = ['setting_id', 'name' 'bit']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['setting_id'], setting['name'], setting['bit']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_element (element):
  table = 'elements'
  ids = {}
  ids['element_id'] = uuid.uuid4().hex
  ids['schema_id'] = element['schema_id']
  columns = ['element_id', 'schema_id', 'element']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['element_id'], setting['name'], setting['bit']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_project ( name, description, branding_text ):
  table = 'projects'
  ids = {}
  ids['project_id'] = uuid.uuid4().hex
  columns = ['project_id', 'name', 'description', 'branding_text']
  vals_format = ['\'%s\'', '\'%s\'', '\'%s\'', '\'%s\'']
  vals = [ids['element_id'], project['name'], project['description'], project['branding_text']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_property (property):
  table = 'properties'
  ids = {}
  columns = ['name', 'value']
  vals_format = ['\'%s\'', '\'%s\'']
  vals = [property['name'], property['value']]
  result = gen_insert_query (table, ids, columns, vals_format, vals)
  return result

def gen_create_item_data ( item_data):
  table = 'item_data'
  ids = {}
  ids['item_id'] = item_data[item_id]
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
  ids['item_id'] = uuid.uuid4().hex
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


'''
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
'''
doManual = raw_input("Generate automatically? (y/n)")
while doManual != "y" and doManual != "n":
  doManual = raw_input("Generate a random test script? Enter yes or no.")

if doManual:
  numProfiles = raw_input ("Enter # of users")
  for i in range(numProfiles):
    profile = {}
    profile['profile_id'] = uuid.uuid4().hex

    username = raw_input("Enter username")
    rx = re.compile('\W') 
    while rx.match(username).group != None and len(username)> 20 and username == "":
      username = raw_input("Enter username Only alphanumeric and underscores; under 20 characters")
    profile['username'] = username

    password = raw_input("Enter user's password")
    while password == "":
      password = raw_input("Enter a non-blank password")
    profile['password'] = sha1(password)
    
  numVocabs = raw_input ("Enter # of vocabs")
  numProjects = raw_input("Enter # of projects")
  numItems = raw_input("Enter # of items per proj")
  masterPath = raw_input("Enter the path to dummy master files (these must later be removed MANUALLY)")
