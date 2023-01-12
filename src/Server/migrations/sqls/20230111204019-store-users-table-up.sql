CREATE TABLE store_users(
    user_id SERIAL PRIMARY KEY,
    user_first_name VARCHAR(255),
    user_last_name VARCHAR(255),
    user_password VARCHAR(255)
);