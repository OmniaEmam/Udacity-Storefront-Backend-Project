CREATE TABLE store_orders(
    order_id SERIAL PRIMARY KEY,
    order_quantity VARCHAR(255),
    order_status  VARCHAR(255),
    order_product_id INT,
    order_user_id INT,
    CONSTRAINT fk_store_products FOREIGN KEY(order_product_id) REFERENCES store_products(product_id),
    CONSTRAINT fk_store_users FOREIGN KEY(order_user_id) REFERENCES store_users(user_id)
);
