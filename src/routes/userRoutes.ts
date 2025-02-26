// libs
import { NextFunction, Request, Response, Router } from 'express';

// controllers
import { getUserInformation, postSignUp, postUserVerification } from '../controllers/userControllers';

// middlewares
import { tokenAuthenticationHandler } from '../middlewares/authenticationHandler';
import { signUpHandler } from '../middlewares/validationHandler';

const userRoutes = Router();

// ===== Ver1.0.0 =====
// POST - sign up
userRoutes.post('/sign-up', signUpHandler, postSignUp);

// POST - user verification
userRoutes.post('/user-verification/:id', tokenAuthenticationHandler, postUserVerification);

// GET - get user information by userId
userRoutes.get('/user-information/:userId', tokenAuthenticationHandler, getUserInformation);

export default userRoutes;
