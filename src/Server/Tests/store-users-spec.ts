import pool from '../db';
import {storeUsers} from '../Models/store-users';
import user from '../Types/usertype';

const userOfStore = new storeUsers();

// Test endpoint responses
describe('Store User Model', () => {
  // Test index be defined
  describe('Store User Functioins to be defined', () => {
    it('should index of users be defined', async () => {
      expect(userOfStore.index).toBeDefined();
    });
    
    it('should index by id of users be defined', async () => {
      expect(userOfStore.indexOfId).toBeDefined();
    });

    it('should add of users be defined', async () => {
      expect(userOfStore.addUser).toBeDefined();
    });

    it('should edit of users be defined', async () => {
      expect(userOfStore.editUser).toBeDefined();
    });

    it('should deleteUser of users be defined', async () => {
      expect(userOfStore.deleteUser).toBeDefined();
    });

    it('should authenticate of users be defined', async () => {
      expect(userOfStore.authenticate).toBeDefined();
    });


  });

  // Test Functions works
  describe('Store User Functions works', () => {

    const User = {
      user_first_name: "Rana",
      user_last_name: "Ahmed",
      user_password: "Rana1234"
    }as user


    async function Truncate() {
      const conn = await pool.connect();
      const sql = `TRUNCATE TABLE store_order_products , store_orders , store_users , store_products RESTART IDENTITY;`;
      await conn.query(sql);
      conn.release();
    }

    it('should create a user', async () => {
      const createdUser : user = await userOfStore.addUser(User);
      if (createdUser) {
        expect(createdUser.user_first_name).toBe(User.user_first_name);
        expect(createdUser.user_last_name).toBe(User.user_last_name);
        //expect(createdUser.user_password).toBe(hashPass(User.user_password));
      }
      await Truncate();
    });

    // Test index return users length
    it('should index of users toBeGreaterThan', async () => {
      await userOfStore.addUser(User);
      const users = await userOfStore.index();
      expect(users.length).toBeGreaterThan(0);
      await Truncate();
    });

    // Test index return users user.user_id
    it('should index return Spisefic user', async () => {
      const addUser = await userOfStore.addUser(User);
      const conn = await pool.connect();
      const sql = `SELECT user_id FROM store_users WHERE user_first_name =($1)`;
      const result = await conn.query(sql, [User.user_first_name]);
      const UserID : number = result.rows[0].user_id;
      conn.release();
      const users = await userOfStore.indexOfId(UserID);
      expect(users.user_first_name).toBe(addUser.user_first_name);
      expect(users.user_last_name).toBe(addUser.user_last_name);
      await Truncate();
    });

    // Test index return users edited
    it('should index edited User', async () => {
      await userOfStore.addUser(User);
      const editedUser = {
        user_first_name: "Mona",
        user_last_name: "Ahmed",
        user_password: "Mona1234"
      }as user;
      const conn = await pool.connect();
      const sql = `SELECT user_id FROM store_users WHERE user_first_name =($1)`;
      const result = await conn.query(sql, [User.user_first_name]);
      const UserID : number = result.rows[0].user_id;
      conn.release();
      const users = await userOfStore.editUser(UserID , editedUser);
      expect(users.user_first_name).toBe(editedUser.user_first_name);
      expect(users.user_last_name).toBe(editedUser.user_last_name);
      await Truncate();
    });

     // Test index return users deleted
     it('should index deleted User', async () => {
      await userOfStore.addUser(User);
      const conn = await pool.connect();
      const sql = `SELECT user_id FROM store_users WHERE user_first_name =($1)`;
      const result = await conn.query(sql, [User.user_first_name]);
      const UserID : number = result.rows[0].user_id;
      conn.release();
      const users = await userOfStore.deleteUser(UserID);
      expect(users.user_first_name).toBeNull;
      expect(users.user_last_name).toBeNull;
      await Truncate();
    });
  });
});