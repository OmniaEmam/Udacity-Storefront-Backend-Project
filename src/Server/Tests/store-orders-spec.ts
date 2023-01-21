import pool from "../db";
import { idOfOrder, InfoToEditOrder, order, storeOrder } from "../Models/store-orders";



const orderOfStore = new storeOrder();
// Test endpoint responses
describe('Store Order Model', () => {

    // Test index be defined
    it('should index of order be defined', async () => {
      const orders: order[] = await orderOfStore.index();
      expect(orders).toBeDefined();
    });

   // Test index return orders length
  it('should index be return orders length', async () => {
    const orders: order[] = await orderOfStore.index();
    expect(orders.length).toBeGreaterThan(0);
  });

  // Test index return orders
  it('should index of order be return orders ', async () => {
    const orders: order[] = await orderOfStore.index();
    const conn = await pool.connect();
    const sql = 'SELECT * FROM store_orders';
    const result = await conn.query(sql);
    conn.release();
    expect(result.rows).toEqual(orders);
  });

  // Test index return specific order by OrderId
  it('should index of order be return one specific order by OrderId ', async () => {
    const id = 1; //Should get from db store_orders
    const orders: idOfOrder[] = await orderOfStore.orderByOrderId(id);

    const conn = await pool.connect();
    const sql = `SELECT store_orders.* , 
                         store_order_products.order_products_quantity , 
                         store_order_products.f_product_id
                         FROM store_orders JOIN store_order_products ON store_orders.order_id = store_order_products.f_order_id
                         WHERE order_id=($1)`;
    const result = await conn.query(sql, [id]);
    conn.release();

    expect(result.rows).toEqual(orders);
  });


  // Test index return specific order by UserId
  it('should index of order be return one specific order by UserId ', async () => {
    const id = 1;  //Should get from db store_orders
    const orders: idOfOrder[] = await orderOfStore.orderByUserId(id);

    const conn = await pool.connect();
    const sql = `SELECT store_orders.* , 
                       store_order_products.order_products_quantity , 
                       store_order_products.f_product_id
                       FROM store_orders JOIN store_order_products ON store_orders.order_id = store_order_products.f_order_id
                       WHERE order_user_id=($1)`;
    const result = await conn.query(sql, [id]);
    conn.release();

    expect(result.rows).toEqual(orders);
  });


  // Test add Order
  it('should add Order ', async () => {
    const productInfo = [{
        f_product_id: 1,  //Should get from db store_orders
        order_products_quantity: 4
    }];
    const order_status = 'active';
    const order_user_id = 1; //Should get from db store_orders

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
    expect(productInfo).toEqual(orderProducts);
    expect(order_status).toEqual(result1.rows[0].order_status);
    expect(order_user_id).toEqual(result1.rows[0].order_user_id);
  });


  // Test edit Order
  it('should edit Order ', async () => {
    const id = 1;  //Should get from db store_orders
    const productInfo = [{
        f_product_id: 1,  //Should get from db store_orders
        order_products_quantity: 4
    }];
    const order_status = 'complete';

    const orders: InfoToEditOrder[] = await orderOfStore.editOrder(id, {
        productInfo,
        order_status,
      });

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
    expect({
        ...result1.rows[0],
        productInfo: orderProducts,
      }).toEqual(orders);
  });

  // Test delete order
  it('should delete order ', async () => {
    const id = 1; //Should get from db store_orders
    const orders: idOfOrder[] = await orderOfStore.deleteOrder(id);
    const conn = await pool.connect();
    const sql1 = `DELETE FROM store_order_products WHERE f_order_id=($1)`;
    await conn.query(sql1, [id]);
    const sql2 = `DELETE FROM store_orders WHERE order_id=($1)`;
    const result = await conn.query(sql2, [id]);
    conn.release();
    expect(result.rows[0]).toEqual(orders);
  });


});