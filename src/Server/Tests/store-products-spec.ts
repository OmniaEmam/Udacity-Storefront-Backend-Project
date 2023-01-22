import pool from '../db';
import { product, storeProduct } from '../Models/store-products';

const productOfStore = new storeProduct();

// Test endpoint responses
describe('Store Product Model', () => {
  // Test index be defined
  describe('Store Product Functioins to be defined', () => {
    it('should index of Product be defined', async () => {
      expect(productOfStore.index).toBeDefined();
    });

    it('should index by id of Product be defined', async () => {
      expect(productOfStore.indexOfId).toBeDefined();
    });

    it('should add of Product be defined', async () => {
      expect(productOfStore.addProduct).toBeDefined();
    });

    it('should edit of Product be defined', async () => {
      expect(productOfStore.editProduct).toBeDefined();
    });

    it('should delete of Product be defined', async () => {
      expect(productOfStore.deleteProduct).toBeDefined();
    });
  });

  // Test Functions works
  describe('Store Product Functions works', () => {
    const Product = {
      product_name: 'WhiteShoes',
      product_price: 300,
      product_category: 'Shoe',
    } as product;

    async function deleteProduct(id: number) {
      return productOfStore.deleteProduct(id);
    }

    it('should create a product', async () => {
      const createdProduct: product = await productOfStore.addProduct(Product);
      if (createdProduct) {
        expect(createdProduct.product_name).toBe(Product.product_name);
        expect(createdProduct.product_price).toBe(Product.product_price);
        expect(createdProduct.product_category).toBe(Product.product_category);
      }
      const conn = await pool.connect();
      const sql = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const result = await conn.query(sql, [Product.product_name]);
      const ProductID: number = result.rows[0].product_id;
      conn.release();
      await deleteProduct(ProductID);
    });

    // Test index return products length
    it('should get product lenghth', async () => {
      await productOfStore.addProduct(Product);
      const products = await productOfStore.index();
      expect(products.length).toBeGreaterThan(0);
      const conn = await pool.connect();
      const sql = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const result = await conn.query(sql, [Product.product_name]);
      const ProductID: number = result.rows[0].product_id;
      conn.release();
      await deleteProduct(ProductID);
    });

    // Test index return products by ProductID
    it('should get product by ProductID', async () => {
      const createdProduct: product = await productOfStore.addProduct(Product);
      const conn = await pool.connect();
      const sql = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const result = await conn.query(sql, [Product.product_name]);
      const ProductID: number = result.rows[0].product_id;
      conn.release();
      const products = await productOfStore.indexOfId(ProductID);
      expect(products.product_name).toBe(createdProduct.product_name);
      expect(products.product_price).toBe(createdProduct.product_price);
      expect(products.product_category).toBe(createdProduct.product_category);
      await deleteProduct(ProductID);
    });

    // Test index return product edited
    it('should index edited product', async () => {
      await productOfStore.addProduct(Product);
      const editedProduct = {
        product_name: 'YellowShoes',
        product_price: 1000,
        product_category: 'Shoes',
      } as product;
      const conn = await pool.connect();
      const sql = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const result = await conn.query(sql, [Product.product_name]);
      const ProductID: number = result.rows[0].product_id;
      conn.release();
      const products = await productOfStore.editProduct(
        ProductID,
        editedProduct
      );
      expect(products.product_name).toBe(editedProduct.product_name);
      expect(products.product_price).toBe(editedProduct.product_price);
      expect(products.product_category).toBe(editedProduct.product_category);
      await deleteProduct(ProductID);
    });

    // Test index return product deleted
    it('should index deleted product', async () => {
      await productOfStore.addProduct(Product);
      const conn = await pool.connect();
      const sql = `SELECT product_id FROM store_products WHERE product_name =($1)`;
      const result = await conn.query(sql, [Product.product_name]);
      const ProductID: number = result.rows[0].product_id;
      conn.release();
      const products = await productOfStore.deleteProduct(ProductID);
      expect(products.product_name).toBeNull;
      expect(products.product_price).toBeNull;
      expect(products.product_category).toBeNull;
    });
  });
});
