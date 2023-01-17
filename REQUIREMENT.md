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
- Index ```app.get('/orders' ,authToken, allOrders);```  [token required]
- Show ```app.get('/orders/byOrderId/:id' ,authToken, orderOfId);```  [token required]
- Create  ```app.post('/orders/add',authToken,addOrder);```  [token required]
- Edit ```app.put('/orders/:id',authToken ,editOrder);``` [token required]
- Delete ```app.delete('/orders/:id',authToken ,deleteOrder);``` [token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category
```CREATE TABLE store_products(product_id SERIAL PRIMARY KEY,product_name VARCHAR(255),product_price INT,product_category VARCHAR(255)); ```

#### User
- id
- firstName
- lastName
- password
```CREATE TABLE store_users(user_id SERIAL PRIMARY KEY,user_first_name VARCHAR(255),user_last_name VARCHAR(255),user_password VARCHAR(255));```

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
```CREATE TABLE store_orders(order_id SERIAL PRIMARY KEY,order_quantity VARCHAR(255),order_status  VARCHAR(255),order_product_id INT,order_user_id INT,CONSTRAINT fk_store_products FOREIGN KEY(order_product_id) REFERENCES store_products(product_id),CONSTRAINT fk_store_users FOREIGN KEY(order_user_id) REFERENCES store_users(user_id));```