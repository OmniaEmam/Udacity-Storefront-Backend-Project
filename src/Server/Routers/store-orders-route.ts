import { Application, Request, Response } from "express";
import { authToken } from "../Handlers/authenticateUser";
import { order, idOfOrder, InfoOfOrder, storeOrder } from "../Models/store-orders";

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
        const { order_quantity } = req.body;
        const { order_status } = req.body;
        const { order_product_id } = req.body;
        const { order_user_id } = req.body;
        if (!order_product_id) {
            res.status(400).json(
              'order_product_id doesnt exist'
            );
            return false;
          }

          else if (!order_user_id) {
            res.status(400).json(
              'order_user_id doesnt exist'
            );
            return false;
          }

        const orders: InfoOfOrder[] = await orderOfStore.addOrder({
            order_quantity,
            order_status,
            order_product_id,
            order_user_id
        });
        res.json({ orders });
    } catch (err) {
        res.status(400).json(err);
    }
};

//Show One Order
const orderOfId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const orders: idOfOrder[] = await orderOfStore.indexOfId(id);
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
        const { order_quantity } = req.body;
        const { order_status } = req.body;
        const { order_product_id } = req.body;
        const { order_user_id } = req.body;

        const orders: InfoOfOrder[] = await orderOfStore.editOrder(id, {
                                                                         order_quantity,
                                                                          order_status,
                                                                         order_product_id,
                                                                         order_user_id
        });
        res.json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};


//Delete Order
const deleteOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const orders: idOfOrder[] = await orderOfStore.deleteOrder(id);
        res.json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};

export default function routesOfOrders(app : Application)
{
    app.get('/orders' ,authToken, allOrders);
    app.get('/orders/byOrderId/:id' ,authToken, orderOfId);
    app.get('/orders/byUserId/:id' ,authToken, orderByUserId);
    app.post('/orders/add',authToken,addOrder);
    app.put('/orders/:id',authToken ,editOrder);
    app.delete('/orders/:id',authToken ,deleteOrder);
}