// libs
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// models
import { insertNewUserSchema, insertNewUserRoleSchema } from '../models/models';
import { insertNewUser, selectUserById } from '../models/userModels';
import { insertNewUserRole } from '../models/userRoleModel';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IBodyPostSignUpService, IPostSignUpService, IUserInformation } from '../utils/interfaces';
import { createTransaction } from '../utils/database';

/**
 * get user information controller
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IUserInformation>> | Errors> }
 */
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
        if (users.length != 1) throw AppError(request.path, 400, 'E4000', ['The user does not exist in database!'], [], []);

        // get user information
        const user = users[0];
        return AppSuccess<IUserInformation>({ data: user });
    } catch (error) {
        // TODO
        throw error;
    }
};

/**
 * sign up service
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IPostSignUpService>> | Errors> }
 */
export const postSignUpService = async (request: Request): Promise<Success<SendData<IPostSignUpService>> | Errors> => {
    // create transaction
    const transaction = await createTransaction();

    try {
        // interfaces body
        interface UserBody extends IBodyPostSignUpService, insertNewUserSchema {}

        // get variables in body
        const userInfo = request.body as unknown as UserBody;

        // create new userId
        userInfo.userId = uuidv4();
        userInfo.currentTime = new Date().getTime();

        // insert new user
        const [insertedUser, errorInsertedUser] = await insertNewUser(transaction, userInfo);

        // check error when insert new user
        if (errorInsertedUser) {
            throw AppError(request.path, 400, 'E8000', ['Error when creating a new user'], [], [errorInsertedUser]);
        }

        // insert user role
        const insertInfo: insertNewUserRoleSchema = {
            roleId: userInfo?.roleId || 1003,
            userId: userInfo.userId,
            currentTime: userInfo.currentTime,
        };

        // insert role for user
        const [insertedRoleUser, errorInsertedRoleUser] = await insertNewUserRole(transaction, insertInfo);

        // check error when insert new role for user
        if (errorInsertedRoleUser) {
            throw AppError(request.path, 400, 'E8001', ['Error when creating a new role for new user'], [], [errorInsertedRoleUser]);
        }

        transaction.commit();

        return AppSuccess<IPostSignUpService>({ data: { message: 'Sign up successfully!' } });
    } catch (error) {
        // role back transaction
        transaction.rollback();

        // throw error for next error handler
        throw error;
    }
};
