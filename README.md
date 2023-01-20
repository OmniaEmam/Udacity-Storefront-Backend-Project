# Udacity-Storefront-Backend-Project
## It is an Backend Store API 
- Typescript API based on udacitiy REQUIREMENTS. Should e ready for front-end developer to develop

## Required Technologies
the application use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

### Ports 
- Server on port 2000 and database on port 5432

### TO Run The Project 
- Download it on your desktop and follow the instructions
- Run in terminal ```npm run build```
- Use the following URL in your Postman 
- ```http://localhost:2000``` 

### Env Variables 

```
POSTGRES_HOST = localhost
POSTGRES_DB = udacity_store_project
POSTGRES_TEST_DB = udacity_store_project
POSTGRES_USER = postgres
POSTGRES_PASSWORD = ####
POSTGRES_PORT = ####
ENV = test
BCRYPT_PASSWORD=#####
SALT_ROUNDS=10
TOKEN_SECRET=#####

```
### Token 
```
After Add user if you a new user OR Authenticate if you already sgin up post man will give you a token
Authorization token in postman Type => Bearer Token  "token"
```

### To test the code 
- Run ```npm run test``` , ```npm run jasmine```

### To run lint or prettier
- Run ```npm run lint``` to run the tests script in ```../package.json```
- Run ```npm run prettier``` to run the tests script in ```../package.json```
