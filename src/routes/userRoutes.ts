// libs
import { NextFunction, Request, Response, Router } from 'express';

// controllers
import { getUserInformationController, postUserRegisterController } from '../controllers/userControllers';

// middlewares
import authenticationHandler from '../middlewares/authenticationHandler';

const userRoutes = Router();

// Ver1.0.1:
userRoutes.get('/user-information/:userId', authenticationHandler, getUserInformationController);

// userRoutes.post('/sign-up', postUserRegisterController);

export default userRoutes;
