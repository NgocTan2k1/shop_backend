// libs
import { Request } from 'express';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// models
import { insertNewUser, selectUserById } from '../models/userModels';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IBodyPostSignUpService, IPostSignUpService, IUserInformation } from '../utils/interfaces';
import { createTransaction } from '../utils/database';
import { insertNewUserRole } from '../models/userRoleModel';
import { insertNewUserSchema, insertNewUserRoleSchema } from '../models/models';

export const getUserInformationService = async (request: Request): Promise<Success<SendData<IUserInformation>> | Errors> => {
    try {
        // interfaces body
        interface userParams {
            userId: string;
        }

        // get variables in body
        const { userId } = request.params as unknown as userParams;

        // get users information in database
        const users = await selectUserById(userId);

        // check user information => TODO
        if (users.length != 1) throw AppError(request.path, 400, 'E0001', ['Bad request!!!'], ['userId']);

        // get user information
        const user = users[0];
        return AppSuccess<IUserInformation>({ data: user });
    } catch (error) {
        // TODO
        throw error;
    }
};
/**
 * post
 * @param {Request} request -
 * @returns
 */
export const postSignUpService = async (request: Request): Promise<Success<SendData<IPostSignUpService>> | Errors> => {
    // create transaction
    const transaction = await createTransaction();

    try {
        // interfaces body
        interface UserBody extends IBodyPostSignUpService, insertNewUserSchema {
            userId: string;
        }

        // get variables in body
        const userInfo = request.body as unknown as UserBody;

        userInfo.userId = 'U' + Date.now();

        // insert new user
        const [insertedUser, errorInsertedUser] = await insertNewUser(transaction, userInfo);

        // check error when insert new user
        if (errorInsertedUser) {
            throw AppError(request.path, 400, 'E0001', ["Can't insert new user"], [], [errorInsertedUser]);
        }

        // insert user role
        const insertInfo: insertNewUserRoleSchema = {
            roleId: userInfo?.role || 0,
            userId: userInfo.userId,
        };

        // insert role for user
        const [insertedRoleUser, errorInsertedRoleUser] = await insertNewUserRole(transaction, insertInfo);

        // check error when insert new role for user
        if (errorInsertedRoleUser) {
            throw AppError(request.path, 400, 'E0001', ["Can't insert role for user"], [], [errorInsertedRoleUser]);
        }

        return AppSuccess<IPostSignUpService>({ data: { message: 'Sign up successfully!' } });
    } catch (error) {
        // role back transaction
        transaction.rollback();

        // throw error for next error handler
        throw error;
    }
};
