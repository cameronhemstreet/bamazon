DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(5) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Monster Energy Drink", "Beverages", 1.99, 500),
  ("BANG", "Beverages", 2.99, 250),
  ("Doritos", "Food", 3.89, 150),
  ("Takis", "Food", 1.99, 200),
  ("Cheetos", "Food", 3.89, 150),
  ("Xbox One", "Video Games", 299.99, 40),
  ("Playstation 4", "Video Games", 249.99, 30),
  ("GTA: 5", "Video Games", 59.99, 60),
  ("Call of Duty: MW Remastered", "Video Games", 59.99, 120),
  ("Bicycle", "Sporting Goods", 399.99, 8);
