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

// Ver1.0.1: login service
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
        if (users.length != 1) throw AppError(request.path, 400, 'E0001', 'Bad request!!!', ['userId']);

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

// Ver1.0.1: refresh token service
export const getRefreshTokenService = async (
    request: Request,
    next: NextFunction
): Promise<Success<SendData<IGetSignInService>> | Errors> => {
    try {
        // interfaces body
        interface UserBody {
            refreshToken: string;
        }

        // get variables in body
        const { refreshToken } = request.body as unknown as UserBody;

        // check refresh token
        if (!refreshToken) {
            throw AppError(request.path, 403, 'E0002', 'Refresh Token not found', ['refreshToken']);
        }

        let authentionError: Errors | null = null;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, user) => {
            if (err) {
                // Forbidden: Invalid token
                authentionError = AppError(request.path, 403, 'E0002', 'Unauthorization', ['refreshToken']);
                return;
            }
            // Set user information
            request.user = user as IUserInformation;

            // Get users information in database
            const users = await selectUserById(request.user?.userId);

            // Check user information
            if (users.length != 1) {
                authentionError = AppError(request.path, 401, 'E0003', 'The user does not exist in database', ['userId']);
                return;
            }
        });
        if (authentionError !== null) {
            throw authentionError;
        }

        // check user information
        if (!request.user) throw AppError(request.path, 400, 'E0001', 'Bad request!!!', ['userId']);

        const user = request.user;

        // generate token & refresh token
        const newToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        return AppSuccess<IGetSignInService>({ data: { userId: user.userId, token: newToken, refreshToken: newRefreshToken } });
    } catch (error) {
        // TODO
        throw error;
    }
};
