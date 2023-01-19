import { Application, Request, Response } from 'express';
import { authToken } from '../Handlers/authenticateUser';
import {
  order,
  idOfOrder,
  storeOrder,
  InfoToAddOrder,
  InfoToEditOrder,
} from '../Models/store-orders';

const orderOfStore = new storeOrder();

//Show all Orders
const allOrders = async (req: Request, res: Response) => {
  try {
    const orders: order[] = await orderOfStore.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

//add Product
const addOrder = async (req: Request, res: Response) => {
  try {
    const { productInfo } = req.body;
    const { order_status } = req.body;
    const { order_user_id } = req.body;

    if (!order_user_id) {
      res.status(402).json('order_user_id doesnt exist');
      return false;
    }

    const orders: InfoToAddOrder[] = await orderOfStore.addOrder({
      productInfo,
      order_status,
      order_user_id,
    });
    res.json({ orders });
  } catch (err) {
    res.status(403).json(err);
  }
};

//Show One Order
const orderOfId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orders: idOfOrder[] = await orderOfStore.orderByOrderId(id);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Show Order of user
const orderByUserId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orders: idOfOrder[] = await orderOfStore.orderByUserId(id);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Edit Order
const editOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const { productInfo } = req.body;
    const { order_status } = req.body;

    const orders: InfoToEditOrder[] = await orderOfStore.editOrder(id, {
      productInfo,
      order_status,
    });
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

// //Delete Order
const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orders: idOfOrder[] = await orderOfStore.deleteOrder(id);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export default function routesOfOrders(app: Application) {
  app.get('/orders', authToken, allOrders);
  app.get('/orders/byOrderId/:id', authToken, orderOfId);
  app.get('/orders/byUserId/:id', authToken, orderByUserId);
  app.post('/orders/add', authToken, addOrder);
  app.put('/orders/:id', authToken, editOrder);
  app.delete('/orders/:id', authToken, deleteOrder);
}
