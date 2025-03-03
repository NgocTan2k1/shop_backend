// libs
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

// middlewares
import { AppError } from '../middlewares/responseHandler';

// interfaces
import { IUserInformation } from './interfaces';

/**
 * generateAccessToken
 * @param { Request } request - Request object
 * @param { IUserInformation } user - User information
 * @returns { string } - Access token
 */
export const generateAccessToken = (request: Request, user: IUserInformation): string => {
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw AppError(request.path, 400, 'E0414', ['ACCESS_TOKEN_SECRET is not defined in the environment variables.'], [], []);
        }

        const secret = process.env.ACCESS_TOKEN_SECRET || 'secret_token';
        const expiration: StringValue = (process.env.ACCESS_TOKEN_EXPIRATION as StringValue) || '5m';

        return jwt.sign(user, secret, { expiresIn: expiration });
    } catch (error) {
        throw error;
    }
};

/**
 * generateRefreshToken
 * @param { Request } request - Request object
 * @param { IUserInformation } user - User information
 * @returns { string } - Refresh token
 */
export const generateRefreshToken = (request: Request, user: IUserInformation): string => {
    try {
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw AppError(request.path, 400, 'E0415', ['REFRESH_TOKEN_SECRET is not defined in the environment variables.'], [], []);
        }
        const secret = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';
        const expiration: StringValue = (process.env.REFRESH_TOKEN_EXPIRATION as StringValue) || '1d';

        return jwt.sign(user, secret, { expiresIn: expiration });
    } catch (error) {
        console.log('error:', error);
        throw error;
    }
};
