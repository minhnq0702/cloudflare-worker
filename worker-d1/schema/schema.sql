-- drop all table
DROP TABLE IF EXISTS sale_order_item;
DROP TABLE IF EXISTS sale_order;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS product;

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
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- add constraint unique product code
CREATE UNIQUE INDEX product_code_unique ON product (code);

-- add table sale_order and sale_order_item
CREATE TABLE sale_order (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE sale_order_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_order_id) REFERENCES sale_order(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);
