import pool from '../db';

export type order = {
  productInfo: order_products[];
  order_id: number;
  f_order_id: number;
  order_status: string;
  order_user_id: number;
  order_products_quantity: number;
  f_product_id: number;
};

export type order_products = {
  order_products_quantity: number;
  f_product_id: number;
};

export type idOfOrder = {
  order_id: number;
};

export type InfoToAddOrder = {
  productInfo: order_products[];
  order_status: string;
  order_user_id: number;
};

export type InfoToEditOrder = {
  productInfo: order_products[];
  order_status: string;
};
//Main Function
export class storeOrder {
  //All Orders on the Site
  async index(): Promise<order[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM store_orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Orders ${err}`);
    }
  }

  //Show One Specific Order By order_id
  async orderByOrderId(id: number): Promise<order[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT store_orders.* , 
                         store_order_products.order_products_quantity , 
                         store_order_products.f_product_id
                         FROM store_orders JOIN store_order_products ON store_orders.order_id = store_order_products.f_order_id
                         WHERE order_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Order has ${id} ${err}`);
    }
  }

  //Show Order of user
  async orderByUserId(id: number): Promise<order[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT store_orders.* , 
                         store_order_products.order_products_quantity , 
                         store_order_products.f_product_id
                         FROM store_orders JOIN store_order_products ON store_orders.order_id = store_order_products.f_order_id
                         WHERE order_user_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Order has ${id} ${err}`);
    }
  }

  //add Order
  async addOrder(order: InfoToAddOrder): Promise<order[]> {
    const { productInfo, order_status, order_user_id } = order;
    try {
      const conn = await pool.connect();
      const orderInfoSql = `INSERT INTO store_orders (order_status , order_user_id) VALUES ($1,$2) RETURNING *`;
      const result1 = await conn.query(orderInfoSql, [
        order_status,
        order_user_id,
      ]);
      const ProductInfoSql = `INSERT INTO store_order_products 
                                  (f_order_id , f_product_id, order_products_quantity) 
                                  VALUES($1, $2, $3) 
                                  RETURNING f_product_id, order_products_quantity`;
      const orderProducts = [];
      for (const product of productInfo) {
        const { f_product_id, order_products_quantity } = product;
        const result2 = await conn.query(ProductInfoSql, [
          result1.rows[0].order_id,
          f_product_id,
          order_products_quantity,
        ]);
        orderProducts.push(result2.rows[0]);
      }
      conn.release();
      return {
        ...result1.rows[0],
        productInfo: orderProducts,
      };
    } catch (err) {
      throw new Error(
        `Could not add new order for user ${order_user_id}. ${err}`
      );
    }
  }

  //Edit Order
  async editOrder(id: number, order: InfoToEditOrder): Promise<order[]> {
    const { productInfo, order_status } = order;
    try {
      const conn = await pool.connect();
      const orderInfoSql =
        'UPDATE store_orders SET order_status = $1 WHERE order_id=($2) RETURNING *';
      const result1 = await conn.query(orderInfoSql, [order_status, id]);
      const ProductInfoSql = `UPDATE store_order_products 
                                   SET f_product_id = $1 , order_products_quantity = $2 
                                   WHERE f_order_id=($3)
                                   RETURNING f_product_id, order_products_quantity`;
      const orderProducts = [];
      for (const product of productInfo) {
        const { f_product_id, order_products_quantity } = product;
        const result2 = await conn.query(ProductInfoSql, [
          f_product_id,
          order_products_quantity,
          id,
        ]);
        orderProducts.push(result2.rows[0]);
      }
      conn.release();
      return {
        ...result1.rows[0],
        productInfo: orderProducts,
      };
    } catch (err) {
      throw new Error(
        `Cannot edit this order because ${id} Already taken ${err}`
      );
    }
  }

  //Delete Order
  async deleteOrder(id: number): Promise<order[]> {
    try {
      const conn = await pool.connect();
      const sql1 = `DELETE FROM store_order_products WHERE f_order_id=($1)`;
      await conn.query(sql1, [id]);
      const sql2 = `DELETE FROM store_orders WHERE order_id=($1)`;
      const result = await conn.query(sql2, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete Order has ${id} ${err}`);
    }
  }
}