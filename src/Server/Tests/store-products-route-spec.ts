import supertest from 'supertest';
import app from '../index'
import { userToken } from '../Handlers/authenticateUser';
import { storeUsers } from '../Models/store-users';
import user from '../Types/usertype';
import pool from '../db';
import { product, storeProduct } from '../Models/store-products';

const userOfStore = new storeUsers();
const productOfStore = new storeProduct();
const request = supertest(app);

describe('Store Product Route', () => {
    const User = {
        user_first_name: "Rana",
        user_last_name: "Ahmed",
        user_password: "Rana1234"
      }as user

      const Product = {
        product_name: 'WhiteShoes',
        product_price: 300,
        product_category: 'Shoe',
      } as product

      const token = userToken(User);

      async function Truncate() {
        const conn = await pool.connect();
        const sql = `TRUNCATE TABLE store_order_products , store_orders , store_users , store_products RESTART IDENTITY;`;
        await conn.query(sql);
        conn.release();
      }

 it('should Show all Products', async () => {
    await productOfStore.addProduct(Product);
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should add Product', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    const response = await request.post('/products/add').send(Product).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Show One Product', async () => {
    await productOfStore.addProduct(Product);
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Edit Product', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    const editedProduct = {
        product_name: 'YellowShoes',
        product_price: 1000,
        product_category: 'Shoes',
      } as product;
    const response = await request.put('/products/1').send(editedProduct).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Delete Product', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    const response = await request.delete('/products/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

});