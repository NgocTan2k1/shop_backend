// libs
import { Router } from 'express';

// controllers
import { getSignIn, getRefreshToken } from '../controllers/authenticationControllers';

// middlewares

const authenticationRoutes = Router();

// Ver1.0.1
authenticationRoutes.get('/sign-in', getSignIn);
authenticationRoutes.get('/refresh-authentication', getRefreshToken);

export default authenticationRoutes;
