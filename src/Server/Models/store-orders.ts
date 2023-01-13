import pool from "../db";

export type order = {
    order_id : number;
    order_quantity: string;
    order_status: string;
    order_product_id: number;
    order_user_id: number;
    
}

export class storeOrder {
    async index(): Promise<order[]> {
        try {
            
            const conn = await pool.connect();
            const sql = 'SELECT * FROM store_orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get Orders ${err}`)
            
        }
    }
}