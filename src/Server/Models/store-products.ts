import pool from '../db';

export type product = {
  product_id: number;
  product_name: string;
  product_price: number;
  product_category: string;
};

export type idOfProduct = {
  product_id: number;
};

export type InfoOfProuduct = {
  product_name: string;
  product_price: number;
  product_category: string;
};

export class storeProduct {
  //Show all Products
  async index(): Promise<product[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM store_products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Products ${err}`);
    }
  }

  //Show One Product
  async indexOfId(id: number): Promise<product[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM store_products WHERE product_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get Product has ${id} ${err}`);
    }
  }

  //add Product
  async addProduct(product: InfoOfProuduct): Promise<product[]> {
    const { product_name, product_price, product_category } = product;
    try {
      const conn = await pool.connect();
      const sql =
        'INSERT INTO store_products (product_name, product_price, product_category) VALUES ($1,$2,$3)';
      const result = await conn.query(sql, [
        product_name,
        product_price,
        product_category,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Cannot add this Product because ${product_name} Already taken ${err}`
      );
    }
  }

  //Edit Product
  async editProduct(id: number, product: InfoOfProuduct): Promise<product[]> {
    const { product_name, product_price, product_category } = product;
    try {
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
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Cannot add this Product because ${product_name} Already taken ${err}`
      );
    }
  }

  //Delete Product
  async deleteProduct(id: number): Promise<product[]> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM store_products WHERE product_id=($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get Product has ${id} ${err}`);
    }
  }
}
