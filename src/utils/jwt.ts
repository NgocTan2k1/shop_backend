// libs
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

// interfaces
import { IUserInformation } from './interfaces';

export const generateAccessToken = (user: IUserInformation) => {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'secret_token';
    const expiration: StringValue = (process.env.ACCESS_TOKEN_EXPIRATION as StringValue) || '5m';

    if (!secret) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment variables.');
    }

    return jwt.sign(user as object, secret, { expiresIn: expiration });
};

export const generateRefreshToken = (user: IUserInformation) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiration = (process.env.REFRESH_TOKEN_EXPIRATION as StringValue) || '1d';

    if (!secret) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment variables.');
    }

    return jwt.sign(user, secret, { expiresIn: expiration });
};
