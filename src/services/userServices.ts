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
import { commit, createTransaction, rollback } from '../utils/database';

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
            throw AppError(request.path, 400, 'E0001', ["Can't insert new user"], [], [errorInsertedUser]);
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
            throw AppError(request.path, 400, 'E0001', ["Can't insert role for user"], [], [errorInsertedRoleUser]);
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
