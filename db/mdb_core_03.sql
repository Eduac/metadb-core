ALTER TABLE permissions 
ADD CONSTRAINT profile_id__fk FOREIGN KEY (profile_id) REFERENCES profiles MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT project_id__fk FOREIGN KEY (project_id) REFERENCES projects MATCH FULL ON DELETE CASCADE
;

ALTER TABLE profiles
ADD CONSTRAINT last_project_id__fk FOREIGN KEY (last_project_id) REFERENCES projects MATCH FULL ON DELETE SET NULL
;

ALTER TABLE project_features
ADD CONSTRAINT pr_el_val__un UNIQUE (project_id, element_id, value),
ADD CONSTRAINT project_f_id__fk FOREIGN KEY (project_id) REFERENCES projects MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT feature_id__fk FOREIGN KEY (feature_id) REFERENCES features MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT element_id__fk FOREIGN KEY (element_id) REFERENCES elements MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT vocab_id__fk FOREIGN KEY (vocab_id) REFERENCES controlled_vocabs MATCH FULL ON DELETE SET NULL
;

ALTER TABLE items
ADD CONSTRAINT it_project_id__fk FOREIGN KEY (project_id) REFERENCES projects MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT it_element_id__fk FOREIGN KEY (element_id) REFERENCES elements MATCH FULL ON DELETE CASCADE,
ADD CONSTRAINT hybrid_pr_el_val__fk FOREIGN KEY (project_id, element_id, value) REFERENCES project_features (project_id, element_id, value) MATCH FULL ON DELETE CASCADE ON UPDATE CASCADE
;

ALTER TABLE item_data
ADD CONSTRAINT it_id__fk FOREIGN KEY (item_id) REFERENCES items MATCH FULL ON DELETE CASCADE
;

ALTER TABLE project_metadata
ADD CONSTRAINT pm_project_id__fk FOREIGN KEY (project_id) REFERENCES projects MATCH FULL ON DELETE CASCADE
;