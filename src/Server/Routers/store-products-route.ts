import { Application , Request,Response } from "express";
import { product , idOfProduct, storeProduct, InfoOfProuduct } from "../Models/store-products";

const productOfStore =new storeProduct();

const allProducts = async (req : Request , res : Response) => {
  try {
    const products : product[] = await productOfStore.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const addProduct = async (req : Request , res : Response) => {
    try {
      const product_name = req.body.product_name as unknown as string;
      const product_price = req.body.product_price as unknown as number;
      const product_category = req.body.product_category as unknown as string;
      
      if (!product_name || !product_price || !product_category)
      {
        res.status(400);
        res.send("Complete all fields");
      }
      const products : InfoOfProuduct[] = await productOfStore.addProduct({
                                                                     product_name,
                                                                     product_price,
                                                                     product_category});
      res.json({products,});
    
    
    } catch (err) {
      res.status(400).json(err);
    }
  };

  const productOfId = async (req : Request , res : Response) => {
    try {
      const id = req.params.id as unknown as number;
      const products : idOfProduct[] = await productOfStore.indexOfId(id);
      res.json(products);
    } catch (err) {
      res.status(400).json(err);
    }
  };


export default function routesOfProducts(app : Application)
{
    app.get('/products' , allProducts);
    app.get('/products/:id' , productOfId);
    app.post('/products/add',addProduct);
}