import { Application, Request, Response } from 'express';
import { authToken } from '../Handlers/authenticateUser';
import {
  product,
  idOfProduct,
  storeProduct,
  InfoOfProuduct,
} from '../Models/store-products';

const productOfStore = new storeProduct();

//Show all Products
const allProducts = async (req: Request, res: Response) => {
  try {
    const products: product[] = await productOfStore.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

//add Product
const addProduct = async (req: Request, res: Response) => {
  try {
    const { product_name } = req.body;
    const { product_price } = req.body;
    const { product_category } = req.body;

    const products: InfoOfProuduct[] = await productOfStore.addProduct({
      product_name,
      product_price,
      product_category,
    });
    res.json({ products });
  } catch (err) {
    res.status(400).json(err);
  }
};

//Show One Product
const productOfId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const products: idOfProduct[] = await productOfStore.indexOfId(id);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Edit Product
const editProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const { product_name } = req.body;
    const { product_price } = req.body;
    const { product_category } = req.body;

    const products: product[] = await productOfStore.editProduct(id, {
      product_name,
      product_price,
      product_category,
    });
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const products: idOfProduct[] = await productOfStore.deleteProduct(id);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

export default function routesOfProducts(app: Application) {
  app.get('/products', allProducts);
  app.get('/products/:id', productOfId);
  app.post('/products/add', authToken, addProduct);
  app.put('/products/:id', authToken, editProduct);
  app.delete('/products/:id', authToken, deleteProduct);
}
