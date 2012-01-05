var TestHelper = function() {
	return {
	getTestItem : function (project, element) {
		return {
			project_id : project.project_id,
			item_index : 1,
			element_id : element.element_id,
			value : 'test_value'
		};	
   }
,	getTestPermission : function (profile, project) {
		return {
			profile_id : profile.profile_id,
			project_id : project.project_id,
			feature_bit_mask : 10101010
		}
	}
,	getTestProject : function () {
		return {
			name : 'test_project',
			description : 'test', 
			branding_text : 'test_brand'
		};	
	}
,	getTestProfile : function () {
		return {
			username : 'test_user',
			first_name : 'Test',
			last_name : 'User',
			email : 'test_user@test.com',
			password : 'justTesting'
		};	
    }	
,   getTestElement : function(schema) {
		return {
            schema_id : schema.schema_id,
            element: 'test_element'
		};	
	}
,	getTestSchema : function () {
		return {
		    name : 'test_schema', 
            description: 'This is the description of a test schema.'
        };	
	}
, 	getTestFeature : function () {
		return {
			name : 'test_feature',
			description : 'test_description',
			feature_bit : 10101010
		};
	}
,	getTestVocab : function (name) {
		return {
			name : name,
			words: 'one; two; three; four'
		};	
	}
,	getTestProjectFeature : function (project, feature, element, vocab) {
		return {
			project_id: project.project_id,
			feature_id : feature.feature_id,
			element_id : element.element_id,
			value : 'test_value',
			setting_bit_mask : 10101010,
			vocab_id : vocab.vocab_id,
		}
	}
	}
};
module.exports = new TestHelper();
