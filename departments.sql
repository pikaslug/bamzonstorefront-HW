DROP TABLE IF EXISTS departments;

-- Departments table
CREATE TABLE departments (
  department_id integer unsigned auto_increment not null,
  department_name varchar(64) not null,
  over_head_costs numeric(10,2) not null,
  PRIMARY KEY (department_id)
);

-- Populating departments table with dummy data
INSERT INTO departments (department_name, over_head_costs) VALUES
  ('bikes', 1000),
  ('backpacks', 2400),
  ('books', 300)
;
