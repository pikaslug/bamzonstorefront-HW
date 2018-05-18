DROP TABLE IF EXISTS products;

-- Product table
CREATE TABLE products (
  item_id integer unsigned auto_increment not null,
  product_name varchar(64) not null,
  department_name varchar(64) not null,
  price numeric(10,2) not null,
  stock_quantity integer unsigned not null,
  product_sales numeric(10,2) default 0,
  PRIMARY KEY (item_id)
);

-- Populating product table with dummy data
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
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

;
