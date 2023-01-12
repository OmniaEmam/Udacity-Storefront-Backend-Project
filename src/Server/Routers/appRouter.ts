import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from '../db';

const appRouter = express.Router();

appRouter.use(cors());
appRouter.use(bodyParser.json());

//create a product
appRouter.post('/products', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
    } catch (err) {
        throw new Error(`Cannot add Products ${err}`)
    }
});

export default appRouter;
