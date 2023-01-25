import supertest from 'supertest';
import app from '../index'
import { userToken } from '../Handlers/authenticateUser';
import { storeUsers } from '../Models/store-users';
import user from '../Types/usertype';
import pool from '../db';
import { product, storeProduct } from '../Models/store-products';
import { order, storeOrder } from '../Models/store-orders';

const userOfStore = new storeUsers();
const productOfStore = new storeProduct();
const orderOfStore = new storeOrder();
const request = supertest(app);

describe('Store Order Route', () => {
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

      const Order = {
        productInfo: [
          {
            f_product_id: 1,
            order_products_quantity: 3,
          },
        ],
        order_status: 'complete',
        order_user_id: 1,
      } as order;

      const token = userToken(User);

      async function Truncate() {
        const conn = await pool.connect();
        const sql = `TRUNCATE TABLE store_order_products , store_orders , store_users , store_products RESTART IDENTITY;`;
        await conn.query(sql);
        conn.release();
      }

 it('should Show all Orders', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    await orderOfStore.addOrder(Order);
    const response = await request.get('/orders').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should add Order', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    const response = await request.post('/orders/add').send(Order).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Show One Order by order Id', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    await orderOfStore.addOrder(Order);
    const response = await request.get('/orders/byOrderId/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Show One Order by user Id', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    await orderOfStore.addOrder(Order);
    const response = await request.get('/orders/byUserId/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });


  it('should Edit Order', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    await orderOfStore.addOrder(Order);
    const editedOrder = {
        productInfo: [
          {
            f_product_id: 1,
            order_products_quantity: 5,
          },
        ],
        order_status: 'active',
      } as order;
    const response = await request.put('/orders/1').send(editedOrder).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Delete Order', async () => {
    await userOfStore.addUser(User);
    await productOfStore.addProduct(Product);
    await orderOfStore.addOrder(Order);
    const response = await request.delete('/orders/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

});