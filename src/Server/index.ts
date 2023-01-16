import express, { Request, Response,Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routesOfProducts from './Routers/store-products-route';
import routesOfUser from './Routers/store-users-route';

const app: Application = express();
const port = 2000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
routesOfProducts(app);
routesOfUser(app);

app.listen(port, () => {
  console.log(`Server run on port ${port}`);
});

export default app;
