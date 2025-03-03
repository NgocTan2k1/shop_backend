// libs
import { Request } from 'express';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// models
import { selectUserLogin } from '../models/userModels';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IGetSignInService, IUserInformation } from '../utils/interfaces';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

// ===== Ver1.0.0 =====
/**
 * get sign in service
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IGetSignInService>> | Errors> } - Success or Errors
 */
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
        if (users.length != 1) throw AppError(request.path, 403, 'E4001', ['The user information not found'], ['']);

        // get user information
        const user = users[0];

        // generate token & refresh token
        const token = generateAccessToken(request, user);
        const refreshToken = generateRefreshToken(request, user);

        return AppSuccess<IGetSignInService>({ data: { userId: user.userId, token: token, refreshToken: refreshToken } });
    } catch (error) {
        // TODO
        throw error;
    }
};

// ===== Ver1.0.0 ===== :
/**
 * get new token & refresh
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IGetSignInService>> | Errors> } - Success or Errors
 */
export const getNewTokenService = async (request: Request): Promise<Success<SendData<IGetSignInService>> | Errors> => {
    try {
        interface UserBody {
            refreshToken: string;
        }

        // get user information
        const user = request.user as IUserInformation;

        // get variables in body
        const { refreshToken } = request.body as unknown as UserBody;

        const newToken = generateAccessToken(request, user);

        return AppSuccess<IGetSignInService>({ data: { userId: user.userId, token: newToken, refreshToken: refreshToken } });
    } catch (error) {
        // TODO
        throw error;
    }
};
