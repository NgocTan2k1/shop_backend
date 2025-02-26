// libs
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUserInformation } from '../utils/interfaces';
import { AppError } from './responseHandler';
import { selectUserById } from '../models/userModels';
import { Errors } from '../utils/types';

// ===== Ver1.0.0 =====
/**
 * Token authentication handler
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 * @returns {void}
 */
export const tokenAuthenticationHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get the authorization header
        const authHeader = request.headers['authorization'] as string;

        // Get the token from the authorization header
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (!token) {
            throw AppError(request.path, 401, 'E0001', ['Token not found'], ['token']);
        }

        // check when verify
        let authenticationError: Errors | null = null;

        // Verify token
        const promiseJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, user) => {
            if (err) {
                // Forbidden: Invalid token
                authenticationError = AppError(request.path, 403, 'E0002', ['Unauthorization'], ['token']);
                return;
            }
            // Set user information
            request.user = user as IUserInformation;

            // Get users information in database
            const users = await selectUserById(request.user?.userId);

            // Check user information
            if (users.length != 1) {
                authenticationError = AppError(request.path, 401, 'E0003', ['The user does not exist in database'], ['userId']);
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

// ===== Ver1.0.0 =====
/**
 * Token authentication handler
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 * @returns {void}
 */
export const refreshTokenAuthenticationHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // interfaces body
        interface UserBody {
            refreshToken: string;
        }

        // get variables in body
        const { refreshToken } = request.body as unknown as UserBody;

        // check refresh token
        if (!refreshToken) {
            throw AppError(request.path, 403, 'E0002', ['Refresh Token not found'], ['refreshToken']);
        }

        let authentionError: Errors | null = null;

        const promiseJWT = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, user) => {
            if (err) {
                // Forbidden: Invalid token
                authentionError = AppError(request.path, 403, 'E0002', ['Unauthorization'], ['refreshToken']);
                return;
            }
            // Set user information
            request.user = user as IUserInformation;

            // Get users information in database
            const users = await selectUserById(request.user?.userId);

            // Check user information
            if (users.length != 1) {
                authentionError = AppError(request.path, 401, 'E0003', ['The user does not exist in database'], ['userId']);
                return;
            }
        });

        // await callback in jwt.verify run
        await Promise.all([promiseJWT]);

        if (authentionError !== null) {
            throw authentionError;
        }

        // check user information
        if (!request.user) throw AppError(request.path, 400, 'E0001', ['Bad request!!!'], ['userId']);

        const user = request.user;
    } catch (error) {
        // TODO
        throw error;
    }
};
