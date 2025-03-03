// libs
import { NextFunction, Request, Response, Router } from 'express';

// controllers
import {
    getUserInformationController,
    postSignUpController,
    postUserVerificationController,
    getUserVerificationController,
} from '../controllers/userControllers';

// middlewares
import { tokenAuthenticationHandler } from '../middlewares/authenticationHandler';
import { signUpHandler } from '../middlewares/validationHandler';

const userRoutes = Router();

// ===== Ver1.0.0 =====
// POST - sign up
userRoutes.post('/sign-up', signUpHandler, postSignUpController);

// ===== Ver1.0.0 =====
// GET - user verification
userRoutes.get('/user-verification', tokenAuthenticationHandler, getUserVerificationController);

// ===== Ver1.0.0 =====
// POST - user verification
userRoutes.post('/user-verification/:verifyToken', tokenAuthenticationHandler, postUserVerificationController);

// ===== Ver1.0.0 =====
// GET - get user information by userId
userRoutes.get('/user-information/:userId', tokenAuthenticationHandler, getUserInformationController);

export default userRoutes;
