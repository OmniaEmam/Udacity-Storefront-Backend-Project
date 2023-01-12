import cors from 'cors';
import express, { Application } from 'express';
import appRouter from './Routers/appRouter';

const app: Application = express();
const port = 5000;


app.use('/', appRouter);
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server run on port ${port}`);
});

export default app;
