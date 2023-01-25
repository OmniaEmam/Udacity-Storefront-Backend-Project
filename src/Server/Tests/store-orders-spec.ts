import pool from '../db';
import { order, storeOrder } from '../Models/store-orders';
import { product, storeProduct } from '../Models/store-products';
import { storeUsers } from '../Models/store-users';
import user from '../Types/usertype';

const orderOfStore = new storeOrder();
const productOfStore = new storeProduct();
const userOfStore = new storeUsers();

// Test endpoint responses
describe('Store Order Model', () => {
  // Test index be defined
  describe('Store Order Functioins to be defined', () => {
    it('should index of Order be defined', async () => {
      expect(orderOfStore.index).toBeDefined();
    });

    it('should index by orderByOrderId of Order be defined', async () => {
      expect(orderOfStore.orderByOrderId).toBeDefined();
    });

    it('should add of Order orderByUserId defined', async () => {
      expect(orderOfStore.orderByUserId).toBeDefined();
    });

    it('should add of Order be defined', async () => {
      expect(orderOfStore.addOrder).toBeDefined();
    });

    it('should edit of Order be defined', async () => {
      expect(orderOfStore.editOrder).toBeDefined();
    });

    it('should delete of Order be defined', async () => {
      expect(orderOfStore.deleteOrder).toBeDefined();
    });
  });

  // Test Functions works
  describe('Store Order Functions works', () => {

    async function Truncate() {
      const conn = await pool.connect();
      const sql = `TRUNCATE TABLE store_order_products , store_orders , store_users , store_products RESTART IDENTITY;`;
      await conn.query(sql);
      conn.release();
    }

    const Product = {
      product_name: 'WhiteShoes',
      product_price: 300,
      product_category: 'Shoe',
    } as product;

    const User = {
      user_first_name: 'Adam',
      user_last_name: 'Sander',
      user_password: 'Adam1234',
    } as user;

    const Order = {
      productInfo: [
        {
          f_product_id: 1,
          order_products_quantity: 3,
        },
      ],
      order_status: 'complete',
      order_user_id: 1,
    } as order;

    // create a order
    it('should create a order', async () => {
      await userOfStore.addUser(User);
      await productOfStore.addProduct(Product);
      const createdOrder: order = await orderOfStore.addOrder(Order);
      expect(createdOrder.productInfo[0].f_product_id).toBe(
        Order.productInfo[0].f_product_id
      );
      expect(createdOrder.productInfo[0].order_products_quantity).toBe(
        Order.productInfo[0].order_products_quantity
      );
      expect(createdOrder.order_status).toBe(Order.order_status);
      expect(createdOrder.order_user_id).toBe(Order.order_user_id);

      //Delete
      await Truncate();
    });

    // edit a order
    it('should edit a order', async () => {
      await userOfStore.addUser(User);
      await productOfStore.addProduct(Product);
      await orderOfStore.addOrder(Order);
      const editedOrder = {
        productInfo: [
          {
            f_product_id: 1,
            order_products_quantity: 5,
          },
        ],
        order_status: 'active',
      } as order;

      // Order
      const conn = await pool.connect();
      const sql = `SELECT order_id FROM store_orders WHERE order_status=($1)`;
      const result = await conn.query(sql, [Order.order_status]);
      const OrderID: number = result.rows[0].order_id;

      // user
      const sqlUser = `SELECT user_id FROM store_users WHERE user_first_name =($1)`;
      const resultUser = await conn.query(sqlUser, [User.user_first_name]);
      const UserID: number = resultUser.rows[0].user_id;
      // Product
      const sqlProduct = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const resultProduct = await conn.query(sqlProduct, [
        Product.product_name,
      ]);
      const ProductID: number = resultProduct.rows[0].product_id;

      conn.release();

      const editOrder: order = await orderOfStore.editOrder(
        OrderID,
        editedOrder
      );
      expect(editOrder.productInfo[0].f_product_id).toBe(
        editedOrder.productInfo[0].f_product_id
      );
      expect(editOrder.productInfo[0].order_products_quantity).toBe(
        editedOrder.productInfo[0].order_products_quantity
      );
      expect(editOrder.order_status).toBe(editedOrder.order_status);

      await Truncate();
    });

    // get orders length
    it('should get orders length', async () => {
      await userOfStore.addUser(User);
      await productOfStore.addProduct(Product);
      await orderOfStore.addOrder(Order);

      const orders: order[] = await orderOfStore.index();
      expect(orders.length).toBeGreaterThan(0);

      await Truncate();
    });

    // delete order
    it('should delete order', async () => {
      await userOfStore.addUser(User);
      await productOfStore.addProduct(Product);
      const createdOrder: order = await orderOfStore.addOrder(Order);

      // Order
      const conn = await pool.connect();
      const sql = `SELECT order_id FROM store_orders WHERE order_status=($1)`;
      const result = await conn.query(sql, [Order.order_status]);
      const OrderID: number = result.rows[0].order_id;
      // user
      const sqlUser = `SELECT user_id FROM store_users WHERE user_first_name =($1)`;
      const resultUser = await conn.query(sqlUser, [User.user_first_name]);
      const UserID: number = resultUser.rows[0].user_id;
      // Product
      const sqlProduct = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const resultProduct = await conn.query(sqlProduct, [
        Product.product_name,
      ]);
      const ProductID: number = resultProduct.rows[0].product_id;

      conn.release();
      await orderOfStore.deleteOrder(OrderID);
      await userOfStore.deleteUser(UserID);
      await productOfStore.deleteProduct(ProductID);
      expect(createdOrder.productInfo).toBeNull;

      await Truncate();
    });
  });
});
