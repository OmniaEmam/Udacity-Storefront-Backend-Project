import pool from '../db';
import { idOfProduct, InfoOfProuduct, product, storeProduct } from '../Models/store-products';

const store = new storeProduct();

// Test endpoint responses
describe('Store Product Model', () => {

  // Test index be defined
  it('should index of products be defined', async () => {
    const products: product[] = await store.index();
    expect(products).toBeDefined();
  });

 // Test index return products length
 it('should index of products be return products length', async () => {
    const products: product[] = await store.index();
    expect(products.length).toBeGreaterThan(0);
  });

   // Test index return products
   it('should index of products be return products ', async () => {
    const products: product[] = await store.index();
    const conn = await pool.connect();
    const sql = 'SELECT * FROM store_products';
    const result = await conn.query(sql);
    conn.release();
    expect(result.rows).toEqual(products);
  });

  // Test index return specific products
  it('should index of products be return one specific product ', async () => {
    const id = 1;
    const products: idOfProduct[] = await store.indexOfId(id);
    const conn = await pool.connect();
    const sql = 'SELECT * FROM store_products WHERE product_id=($1)';
    const result = await conn.query(sql, [id]);
    conn.release();
    expect(result.rows[0]).toEqual(products);
  });

// Test add product
it('should add product ', async () => {
    const product_name = 'BrowenShoes';
    const product_price = 300;
    const product_category = 'Shoes';

    const products: InfoOfProuduct[] = await store.addProduct({
        product_name,
        product_price,
        product_category,
    });

    const conn = await pool.connect();
    const sql =
      'INSERT INTO store_users (user_first_name, user_last_name, user_password) VALUES ($1,$2,$3)';
    const result = await conn.query(sql, [
        product_name,
        product_price,
        product_category,
    ]);
    conn.release();

    expect(result.rows[0]).toEqual(products);
  });

   // Test edit product
   it('should edit product ', async () => {
    const id = 8;
    const product_name = 'BrowenShoes';
    const product_price = 300;
    const product_category = 'Shoes';
    const products: InfoOfProuduct[] = await store.editProduct(id, {
        product_name,
        product_price,
        product_category,
      });
  
      const conn = await pool.connect();
      const sql =
      'UPDATE store_products SET product_name = $1, product_price = $2, product_category = $3 WHERE product_id=($4)';
      const result = await conn.query(sql, [
        product_name,
        product_price,
        product_category,
        id,
      ]);
      conn.release();
      
      expect(result.rows[0]).toEqual(products);
  });

   // Test delete product
   it('should delete product ', async () => {
    const id = 8;
    const products: idOfProduct[] = await store.deleteProduct(id);
    const conn = await pool.connect();
    const sql = `DELETE FROM store_products WHERE product_id=($1)`;
    const result = await conn.query(sql, [id]);
    conn.release();
    
    expect(result.rows[0]).toEqual(products);
  });
});