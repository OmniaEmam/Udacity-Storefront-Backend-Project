import supertest from 'supertest';
import app from '../index'
import { userToken } from '../Handlers/authenticateUser';
import { storeUsers } from '../Models/store-users';
import user from '../Types/usertype';
import pool from '../db';

const userOfStore = new storeUsers();
const request = supertest(app);

describe('Store User Route', () => {
    const User = {
        user_first_name: "Rana",
        user_last_name: "Ahmed",
        user_password: "Rana1234"
      }as user

      const token = userToken(User);

      async function Truncate() {
        const conn = await pool.connect();
        const sql = `TRUNCATE TABLE store_order_products , store_orders , store_users , store_products RESTART IDENTITY;`;
        await conn.query(sql);
        conn.release();
      }

 it('should Show all Users', async () => {
    await userOfStore.addUser(User);
    const response = await request.get('/users').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should add User', async () => {
    const response = await request.post('/users/add').send(User);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Show One User', async () => {
    await userOfStore.addUser(User);
    const response = await request.get('/users/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Edit User', async () => {
    await userOfStore.addUser(User);
    const editedUser = {
      user_first_name: "Mona",
      user_last_name: "Ahmed",
      user_password: "Mona1234"
    }as user;
    const response = await request.put('/users/1').send(editedUser).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should Delete User', async () => {
    await userOfStore.addUser(User);
    const response = await request.delete('/users/1').set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });

  it('should authenticate User', async () => {
    await userOfStore.addUser(User);
    const authenticateUser = {
      user_first_name: "Rana",
      user_password: "Rana1234"
    }as user;
    const response = await request.post('/users/authenticate').send(authenticateUser).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    await Truncate();
  });
});