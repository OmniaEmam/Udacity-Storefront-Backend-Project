import pool from "../db";

export type product = {
    product_id: Number;
    product_name: string;
    product_price: Number;
    product_category: string;
}

export class storeProduct {
    async index(): Promise<product[]> {
        try {
            
            const conn = await pool.connect();
            const sql = 'SELECT * FROM store_products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get Products ${err}`)
            
        }
    }
}