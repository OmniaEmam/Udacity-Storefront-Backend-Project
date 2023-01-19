CREATE TABLE store_order_products (
    order_products_id SERIAL PRIMARY KEY,
    order_products_quantity integer,
    f_product_id INT,
    f_order_id INT,
    CONSTRAINT fk_store_products FOREIGN KEY(f_product_id) REFERENCES store_products(product_id),
    CONSTRAINT fk_store_orders FOREIGN KEY(f_order_id) REFERENCES store_orders(order_id)
);