// libs
import { NextFunction, Request, Response, Router } from 'express';
import { getUserInformationController } from '../controllers/userControllers';

const userRoutes = Router();

userRoutes.get('/user-information', getUserInformationController);

export default userRoutes;
