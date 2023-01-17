import pool from "../db";

export type order = {
    order_id: number;
    order_quantity: string;
    order_status: string;
    order_product_id: number;
    order_user_id: number;

}

export type idOfOrder = {
    order_id: number;
}

export type InfoOfOrder = {
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


    //Show One Order
    async indexOfId(id: number): Promise<order[]> {
        try {
            const conn = await pool.connect();
            const sql = `SELECT * FROM store_orders WHERE order_id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get Order has ${id} ${err}`)

        }
    }

        //Show Order of user
        async orderByUserId(id: number): Promise<order[]> {
            try {
                const conn = await pool.connect();
                const sql = `SELECT * FROM store_orders WHERE order_user_id=($1)`;
                const result = await conn.query(sql, [id]);
                conn.release();
                return result.rows;
            } catch (err) {
                throw new Error(`Cannot get Order has ${id} ${err}`)
    
            }
        }


    //add Order
    async addOrder(order: InfoOfOrder): Promise<order[]> {
        const {
            order_quantity,
            order_status,
            order_product_id,
            order_user_id
        } = order;
        try {
            const conn = await pool.connect();
            const sql = "INSERT INTO store_orders (order_quantity, order_status, order_product_id ,order_user_id ) VALUES ($1,$2,$3,$4)";
            const result = await conn.query(sql, [order_quantity, order_status, order_product_id, order_user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add this Order because Order id Already taken ${err}`)

        }
    }

    //Edit Order
    async editOrder(id: number, order: InfoOfOrder): Promise<order[]> {
        const {
            order_quantity,
            order_status,
            order_product_id,
            order_user_id
        } = order;
        try {
            const conn = await pool.connect();
            const sql = "UPDATE store_orders SET order_quantity = $1, order_status = $2, order_product_id = $3 , order_user_id = $4 WHERE order_id=($5)";
            const result = await conn.query(sql, [order_quantity, order_status, order_product_id, order_user_id, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot edit this order because ${id} Already taken ${err}`)

        }
    }

    //Delete Order
    async deleteOrder(id: number): Promise<order[]> {
        try {
            const conn = await pool.connect();
            const sql = `DELETE FROM store_orders WHERE order_id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete Order has ${id} ${err}`)

        }
    }
}

