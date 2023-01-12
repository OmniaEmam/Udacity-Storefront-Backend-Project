import pool from "../db";

export type user = {
    user_id : Number;
    user_first_name: string;
    user_last_name: string;
    user_password: string;
}

export class storeUsers {
    async index(): Promise<user[]> {
        try {
            
            const conn = await pool.connect();
            const sql = 'SELECT * FROM store_users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get Users ${err}`)
            
        }
    }
}