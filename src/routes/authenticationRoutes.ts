// libs
import { Router } from 'express';

// controllers
import { getSignIn, getNewTokenController } from '../controllers/authenticationControllers';
import { refreshTokenAuthenticationHandler } from '../middlewares/authenticationHandler';

// middlewares

const authenticationRoutes = Router();

// ===== Ver1.0.0 =====
// GET - sign in
authenticationRoutes.get('/sign-in', getSignIn);

// ===== Ver1.0.0 =====
// GET - refresh token
authenticationRoutes.get('/refresh-authentication', refreshTokenAuthenticationHandler, getNewTokenController);

export default authenticationRoutes;
