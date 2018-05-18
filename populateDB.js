const mysql = require('mysql')


let connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.MYSQL_USR,
  password : process.env.MYSQL_PWD,
});

connection.connect()

// Creates new DB if it doesn't yet exist
connection.query(`CREATE DATABASE IF NOT EXISTS bamazon`, function(err, result) {
  if (err) throw err;
})

// Select 'bamazon' db
connection.query(`USE bamazon`, function(err, result) {
  if (err) throw err;
})

/////////////////////////////////////////////////
// PRODUCTS
/////////////////////////////////////////////////

connection.query(`DROP TABLE IF EXISTS products;`, function(err, result) {
  if (err) throw err;
});

connection.query(`CREATE TABLE products (
  item_id integer unsigned auto_increment not null,
  product_name varchar(64) not null,
  department_id integer unsigned,
  price numeric(10,2) not null,
  stock_quantity integer unsigned not null,
  product_sales numeric(10,2) default 0,
  PRIMARY KEY (item_id)
);`, function(err, result) {
  if (err) throw err;
});

connection.query(`INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES
    ('Huffy 26 Mens Alpine Mountain Bike', 'bikes', 102.10, 10),
    ('Firmstrong Urban Lady Beach Cruiser Bicycle', 'bikes', 209.99, 3),
    ('GMC Denali Road Bike', 'bikes', 330.22, 20),
    ('6KU Aluminum Fixed Gear Single-Speed Fixie Urban Track Bike', 'bikes', 233.83, 10),
    ('12 Rules for Life', 'books', 15.57, 5),
    ('Say Youre Sorry', 'books', 38.95, 9),
    ('How to Change Your Mind', 'books', 17.54, 10),
    ('Venture Pal Lightweight Packable Durable Travel Hiking Backpack Daypack', 'backpacks', 20.99, 20),
    ('KAVU Rope Bag', 'backpacks', 89.95, 50),
    ('20L/33L', 'backpacks', 12.99, 12),
    ('ZOMAKE Ultra Lightweight Packable', 'books', 15.99, 2)

;`, function(err, result) {
  if (err) throw err;
})

/////////////////////////////////////////////////
// DEPARTMENTS
/////////////////////////////////////////////////

connection.query(`DROP TABLE IF EXISTS departments;`, function(err, result) {
  if (err) throw err;
});

connection.query(`CREATE TABLE departments (
  department_id integer unsigned auto_increment not null,
  department_name varchar(64) not null,
  over_head_costs numeric(10,2) not null,
  PRIMARY KEY (department_id)
);`, function(err, result) {
  if (err) throw err;
});

connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES
  ('bikes', 1000),
  ('backpacks', 2400),
  ('books', 300);`, function(err, result) {
  if (err) throw err;
});


/////////////////////////////////////////////////
// FOREIGN KEY
/////////////////////////////////////////////////

connection.query(`ALTER TABLE products ADD FOREIGN KEY (department_id)
  REFERENCES departments(department_id)`, function(err, result) {
    if (err) throw err;
  })

connection.end();
