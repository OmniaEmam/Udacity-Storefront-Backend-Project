# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index ```app.get('/products' , allProducts); ```
- Show ``` app.get('/products/:id' , productOfId); ```
- Create ```app.post('/products/add',authToken,addProduct); ``` [token required]
- Edit ```app.put('/products/:id',authToken ,editProduct); ``` [token required]
- Delete ```app.delete('/products/:id',authToken ,deleteProduct);``` [token required]


#### Users
- Index ```app.get('/users' ,authToken, allUser);```  [token required]
- Show ```app.get('/users/:id' ,authToken ,userOfId);```  [token required]
- Create  ```app.post('/users/add',addUser);``` 
- Edit ```app.put('/users/:id', authToken ,editUser);``` [token required]
- Delete ``` app.delete('/users/:id',authToken ,deleteUser);``` [token required]
- Authenticate ```app.post('/users/authenticate', authenticateUser);```

#### Orders
- Current Order by user ```app.get('/orders/byUserId/:id' ,authToken, orderByUserId);```[token required]
- Current Order by order ``` app.get('/orders/byOrderId/:id', authToken, orderOfId);```[token required]
- Index ```app.get('/orders' ,authToken, allOrders);```  [token required]
- Create  ```app.post('/orders/add',authToken,addOrder);```  [token required]
- How to enter value inito post man body => 
- ``` {
    "productInfo": 
    [{
        "f_product_id": number,
        "order_products_quantity": number
    }],
    "order_status": "active / complete"
    "order_user_id": number}  ```
    
- Edit ```app.put('/orders/:id',authToken ,editOrder);``` [token required]
-  How to enter value inito post man body =>
-   ``` {
    "productInfo": 
    [{
        "f_product_id": number,
        "order_products_quantity": number
    }],
    "order_status": "active / complete" } ```
    
- Delete ```app.delete('/orders/:id',authToken ,deleteOrder);``` [token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category
```CREATE TABLE store_products(product_id SERIAL PRIMARY KEY,product_name VARCHAR(255),product_price INT,product_category VARCHAR(255)); ```

- You should insert values here or in postman to test the code like this :
```INSERT INTO store_products (product_name, product_price, product_category) VALUES ('RedShoe',300,'Shoes); ```



#### User
- id
- firstName
- lastName
- password
```CREATE TABLE store_users(user_id SERIAL PRIMARY KEY,user_first_name VARCHAR(255),user_last_name VARCHAR(255),user_password VARCHAR(255));```

- You should insert values here or in postman to test the code like this :
```INSERT INTO store_users (user_first_name, user_last_name, user_password) VALUES ('John','Adem','John1234'); ```

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
- 
```CREATE TYPE status AS ENUM ('active', 'complete');
   CREATE TABLE store_orders(
    order_id SERIAL PRIMARY KEY,
    order_status  status,
    order_user_id INT,
    CONSTRAINT fk_store_users FOREIGN KEY(order_user_id) REFERENCES store_users(user_id)
);```
- 
```CREATE TABLE store_order_products (
    order_products_id SERIAL PRIMARY KEY,
    order_products_quantity integer,
    f_product_id INT,
    f_order_id INT,
    CONSTRAINT fk_store_products FOREIGN KEY(f_product_id) REFERENCES store_products(product_id),
    CONSTRAINT fk_store_orders FOREIGN KEY(f_order_id) REFERENCES store_orders(order_id));```


- You should insert values here or in postman to test the code like this :
```INSERT INTO store_orders (order_status , order_user_id) VALUES ('active',1); ```
```INSERT INTO store_order_products 
                                  (f_order_id , f_product_id, order_products_quantity) 
                                  VALUES(1, 1,2); ```

