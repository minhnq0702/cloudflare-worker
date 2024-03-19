-- DROP TABLE IF EXISTS;
DROP TABLE IF EXISTS sale_order_item;
DROP TABLE IF EXISTS sale_order;
DROP TABLE IF EXISTS customer;

-- add table customer
CREATE TABLE customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NULL
);

-- add table product
CREATE TABLE product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- add table sale_order and sale_order_item
CREATE TABLE sale_order (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE sale_order_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_order_id) REFERENCES sale_order(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);