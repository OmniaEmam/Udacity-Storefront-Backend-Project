import pool from '../db';
import hashPass from '../Handlers/hashPass';
import { idOfuser, InfoOfuser, storeUsers, user, userAuth } from '../Models/store-users';
import bcrypt from 'bcrypt';
const userOfStore = new storeUsers();


// Test endpoint responses
describe('Store User Model', () => {

  // Test index be defined
  it('should index of users be defined', async () => {
    const users: user[] = await userOfStore.index();
    expect(users).toBeDefined();
  });

  // Test index return users length
  it('should index of users be return users length', async () => {
    const users: user[] = await userOfStore.index();
    expect(users.length).toBeGreaterThan(0);
  });

  // Test index return users
  it('should index of users be return users ', async () => {
    const users: user[] = await userOfStore.index();
    const conn = await pool.connect();
    const sql = 'SELECT * FROM store_users';
    const result = await conn.query(sql);
    conn.release();
    expect(result.rows).toEqual(users);
  });

  // Test index return specific user
  it('should index of users be return one specific user ', async () => {
    const id = 1;
    const users: idOfuser[] = await userOfStore.indexOfId(id);
    const conn = await pool.connect();
    const sql = 'SELECT * FROM store_users';
    const result = await conn.query(sql);
    conn.release();
    expect(result.rows[0]).toEqual(users);
  });


  // Test add user
  it('should add user ', async () => {
    const user_first_name = 'Rana';
    const user_last_name = 'Salah';
    const user_password = 'Rana1234';

    const users: InfoOfuser[] = await userOfStore.addUser({
      user_first_name,
      user_last_name,
      user_password,
    });

    const conn = await pool.connect();
    const sql =
      'INSERT INTO store_users (user_first_name, user_last_name, user_password) VALUES ($1,$2,$3)';
    const result = await conn.query(sql, [
      user_first_name,
      user_last_name,
      hashPass(user_password),
    ]);
    conn.release();

    expect(result.rows[0]).toEqual(users);
  });


  // Test edit user
  it('should edit user ', async () => {
    const id = 50;
    const user_first_name = 'Rana';
    const user_last_name = 'Nour';
    const user_password = 'Rana1234';

    const users: InfoOfuser[] = await userOfStore.editUser(id, {
      user_first_name,
      user_last_name,
      user_password,
    });

    const conn = await pool.connect();
    const sql =
      'UPDATE store_users SET user_first_name = $1, user_last_name = $2, user_password = $3 WHERE user_id=($4)';
    const result = await conn.query(sql, [
      user_first_name,
      user_last_name,
      hashPass(user_password),
      id,
    ]);
    conn.release();
    
    expect(result.rows[0]).toEqual(users);
  });


  // Test delete user
  it('should delete user ', async () => {
    const id = 50;

    const users: idOfuser[] = await userOfStore.deleteUser(id);
    const conn = await pool.connect();
      const sql = `DELETE FROM store_users WHERE user_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
    
    expect(result.rows[0]).toEqual(users);
  });


  // Test authenticate user
  it('should authenticate user ', async () => {
    const user_first_name = 'Mona';
    const user_password = 'Mona1234';

    const users: userAuth[] | null = await userOfStore.authenticate(
      user_first_name,
      user_password
    );
    const conn = await pool.connect();
      const sql =
        'SELECT user_password FROM store_users WHERE user_first_name=($1)';
      const result = await conn.query(sql, [user_first_name]);

      if (result.rows.length > 0) {
        const { user_password: hashPass } = result.rows[0];
        if (
          bcrypt.compareSync(
            `${user_password}${process.env.BCRYPT_PASSWORD}`,
            hashPass
          )
        ) {
          const sql = 'SELECT * FROM store_users WHERE user_first_name =($1)';
          const result = await conn.query(sql, [user_first_name]);
          conn.release();
          return result.rows[0];
        }
      }
      conn.release();
    
    expect(result.rows[0]).toEqual(users);
  });



});
