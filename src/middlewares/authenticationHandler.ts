// libs
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUserInformation } from '../utils/interfaces';
import { AppError } from './responseHandler';
import { selectUserById } from '../models/userModels';
import { Errors } from '../utils/types';

// Ver1.0.0: authentication handler
const authenticationHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get the authorization header
        const authHeader = request.headers['authorization'] as string;

        // Get the token from the authorization header
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (!token) {
            throw AppError(request.path, 401, 'E0001', 'Token not found', ['token']);
        }

        // check when verify
        let authenticationError: Errors | null = null;

        // Verify token
        const promiseJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, user) => {
            if (err) {
                // Forbidden: Invalid token
                authenticationError = AppError(request.path, 403, 'E0002', 'Unauthorization', ['token']);
                return;
            }
            // Set user information
            request.user = user as IUserInformation;

            // Get users information in database
            const users = await selectUserById(request.user?.userId);

            // Check user information
            if (users.length != 1) {
                authenticationError = AppError(request.path, 401, 'E0003', 'The user does not exist in database', ['userId']);
                return;
            }
        });

        // await callback in jwt.verify run
        await Promise.all([promiseJWT]);

        // check error when verify
        if (authenticationError !== null) throw authenticationError;

        // call next function
        next();
    } catch (error) {
        // call error handlers
        return next(error);
    }
};

export default authenticationHandler;
