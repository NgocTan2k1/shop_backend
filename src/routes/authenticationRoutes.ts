// libs
import { Router } from 'express';

// controllers
import { getSignIn, getRefreshToken } from '../controllers/authenticationControllers';
import { refreshTokenAuthenticationHandler } from '../middlewares/authenticationHandler';

// middlewares

const authenticationRoutes = Router();

// ===== Ver1.0.0 =====
// GET - sign in
authenticationRoutes.get('/sign-in', getSignIn);

// GET - refresh token
authenticationRoutes.get('/refresh-authentication', refreshTokenAuthenticationHandler, getRefreshToken);

export default authenticationRoutes;
