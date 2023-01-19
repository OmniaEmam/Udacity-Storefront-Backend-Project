import pool from '../db';
import bcrypt from 'bcrypt';
import hashPass from '../Handlers/hashPass';

export type user = {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_password: string;
};
export type idOfuser = {
  user_id: number;
};

export type InfoOfuser = {
  user_first_name: string;
  user_last_name: string;
  user_password: string;
};

export type userAuth = {
  user_first_name: string;
  user_password: string;
};
export class storeUsers {
  //Show all Users
  async index(): Promise<user[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM store_users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Users ${err}`);
    }
  }

  //Show One User
  async indexOfId(id: number): Promise<user[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM store_users WHERE user_id =($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get User has ${id} ${err}`);
    }
  }

  //add User
  async addUser(user: InfoOfuser): Promise<user[]> {
    const { user_first_name, user_last_name, user_password } = user;
    try {
      const conn = await pool.connect();
      const sql =
        'INSERT INTO store_users (user_first_name, user_last_name, user_password) VALUES ($1,$2,$3)';
      const result = await conn.query(sql, [
        user_first_name,
        user_last_name,
        hashPass(user_password),
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Cannot add this User because ${user_first_name} Already taken ${err}`
      );
    }
  }

  //Edit User
  async editUser(id: number, user: InfoOfuser): Promise<user[]> {
    const { user_first_name, user_last_name, user_password } = user;
    try {
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
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Cannot add this User because ${user_first_name} Already taken ${err}`
      );
    }
  }

  //Delete User
  async deleteUser(id: number): Promise<user[]> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM store_users WHERE user_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get User has ${id} ${err}`);
    }
  }

  //authenticate User
  async authenticate(
    user_first_name: string,
    user_password: string
  ): Promise<user[] | null> {
    try {
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
      return null;
    } catch (err) {
      throw new Error(`Could not find user ${user_first_name}. ${err}`);
    }
  }
}
