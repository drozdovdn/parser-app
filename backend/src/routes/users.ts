import { Router } from 'express';

import { getCurrentUser, getUsers } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);

export default userRouter;
