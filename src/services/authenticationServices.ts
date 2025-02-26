// libs
import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IGetSignInService, IUserInformation } from '../utils/interfaces';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { selectUserById, selectUserLogin } from '../models/userModels';

// ===== Ver1.0.0 ===== : sign in service
export const getSignInService = async (request: Request): Promise<Success<SendData<IGetSignInService>> | Errors> => {
    try {
        // interfaces body
        interface UserBody {
            username: string;
            password: string;
        }

        // get variables in body
        const { username, password } = request.body as unknown as UserBody;

        // get users information in database
        const users = await selectUserLogin(username, password);

        // check user information
        if (users.length != 1) throw AppError(request.path, 400, 'E0001', ['Bad request!!!'], ['userId']);

        // get user information
        const user = users[0];

        // generate token & refresh token
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return AppSuccess<IGetSignInService>({ data: { userId: user.userId, token: token, refreshToken: refreshToken } });
    } catch (error) {
        // TODO
        throw error;
    }
};

// ===== Ver1.0.0 ===== : refresh token service
export const getRefreshTokenService = async (
    request: Request,
    next: NextFunction
): Promise<Success<SendData<IGetSignInService>> | Errors> => {
    try {
        const user = request.user as IUserInformation;

        const newToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        return AppSuccess<IGetSignInService>({ data: { userId: user.userId, token: newToken, refreshToken: newRefreshToken } });
    } catch (error) {
        // TODO
        throw error;
    }
};
