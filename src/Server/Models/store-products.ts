import pool from "../db";

export type product = {
    product_id: number;
    product_name: string;
    product_price: number;
    product_category: string;
}

export type idOfProduct = {
    product_id: number;
}

export type InfoOfProuduct = {
    product_name: string;
    product_price: number;
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


    async indexOfId(id: number): Promise<product[]> {
        try {
            const conn = await pool.connect();
            const sql = `SELECT * FROM store_products WHERE product_id=($1)`;
            const result = await conn.query(sql , [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get Product has ${id} ${err}`)
            
        }
    }

    async addProduct(product: InfoOfProuduct): Promise<product[]> {
        const {
                product_name,
                product_price,
                product_category } = product;
        try {
            const conn = await pool.connect();
            const sql = `INSERT INTO store_products 
                         (product_name, product_price, product_category) 
                         VALUES ($1,$2,$3) RETURNING *`;
            const result = await conn.query(sql , [product_name , product_price , product_category]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add this Product because ${product_name} Already taken ${err}`)
            
        }
    }
}