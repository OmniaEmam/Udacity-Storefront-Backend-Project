import { Application, Request, Response } from 'express';
import { authToken, userToken } from '../Handlers/authenticateUser';
import { storeUsers } from '../Models/store-users';
import user from '../Types/usertype';

const userOfStore = new storeUsers();

//Show all Users
const allUser = async (req: Request, res: Response) => {
  try {
    const users: user[] = await userOfStore.index();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

//add User
const addUser = async (req: Request, res: Response) => {
  try {
    const { user_first_name } = req.body;
    const { user_last_name } = req.body;
    const { user_password } = req.body;

    const users: user = await userOfStore.addUser({
      user_first_name,
      user_last_name,
      user_password,
    });

    res.json(userToken(users));
  } catch (err) {
    res.status(400).json(err);
  }
};

//Show One User
const userOfId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const users: user = await userOfStore.indexOfId(id);
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Edit User
const editUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const { user_first_name } = req.body;
    const { user_last_name } = req.body;
    const { user_password } = req.body;

    const users: user = await userOfStore.editUser(id, {
      user_first_name,
      user_last_name,
      user_password,
    });

    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Delete User
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const users: user = await userOfStore.deleteUser(id);
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

//authenticate User
const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { user_first_name } = req.body;
    const { user_password } = req.body;
    const users: user | null = await userOfStore.authenticate(
      user_first_name,
      user_password
    );
    res.json(userToken(users));
  } catch (err) {
    res.status(400).json(err);
  }
};

export default function routesOfUser(app: Application) {
  app.get('/users', authToken, allUser);
  app.get('/users/:id', authToken, userOfId);
  app.post('/users/add', addUser);
  app.put('/users/:id', authToken, editUser);
  app.delete('/users/:id', authToken, deleteUser);
  app.post('/users/authenticate', authenticateUser);
}
