-- CREATE TYPE status AS ENUM ('active', 'complete');
CREATE TABLE store_orders(
    order_id SERIAL PRIMARY KEY,
    order_status  status,
    order_user_id INT,
    CONSTRAINT fk_store_users FOREIGN KEY(order_user_id) REFERENCES store_users(user_id)
);
