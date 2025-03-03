// libs
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// models
import { insertNewUserSchema, insertNewUserRoleSchema } from '../models/models';
import { insertNewUser, selectUserById, selectVerifcationInformation, updateNewVerifyCode, updateUserVerification } from '../models/userModels';
import { insertNewUserRole } from '../models/userRoleModel';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IBodyPostSignUpService, IMessage, IUserInformation } from '../utils/interfaces';
import { createTransaction } from '../utils/database';
import { getCurrentTimeAt } from '../utils/common';
import { sendMail } from '../utils/transporter';

/**
 * sign up service
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IMessage>> | Errors> }
 */
export const postSignUpService = async (request: Request): Promise<Success<SendData<IMessage>> | Errors> => {
    // create transaction
    const transaction = await createTransaction();

    try {
        // interfaces body
        interface UserBody extends IBodyPostSignUpService, insertNewUserSchema {}

        // get variables in body
        const userInfo = request.body as unknown as UserBody;

        // create new userId
        userInfo.userId = uuidv4();
        userInfo.currentTime = getCurrentTimeAt();

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

        return AppSuccess<IMessage>({ data: { message: 'Sign up successfully!' } });
    } catch (error) {
        // role back transaction
        transaction.rollback();

        // throw error for next error handler
        throw error;
    }
};

/**
 * get user verification service
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IMessage>> | Errors> }
 */
export const getUserVerificationService = async (request: Request): Promise<Success<SendData<IMessage>> | Errors> => {
    // create transaction
    const transaction = await createTransaction();

    try {
        // get variables in request
        const user = request.user as IUserInformation;

        // check verification information
        if (user.verify === 1) {
            throw AppError(request.path, 400, 'E4002', ['The user already authenticated!'], [], []);
        }

        // generate verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000);
        const verifyCodeExpiration = getCurrentTimeAt(Number(process.env.VERIFY_EXPIRATION) || 5);
        const currentTime = getCurrentTimeAt();

        // update verification code in database
        const [updatedUser, errorUpdatedUser] = await updateNewVerifyCode(transaction, { userId: user.userId, verifyCode, verifyCodeExpiration, currentTime });

        // check error when update verification code
        if (errorUpdatedUser) {
            throw AppError(request.path, 400, 'E8002', ['Error when generate verification code!'], [], [errorUpdatedUser]);
        }

        // send verification code to user by email => TODO
        const info = await sendMail({
            from: process.env.HOST_EMAIL || '',
            to: 'colorstore2024@gmail.com',
            subject: 'Verification code',
            html: `
                <div>
                    <h1>Verification code</h1>
                    <p>Your verification code is: ${verifyCode}</p>
                </div>
            `,
        });
        console.log(info);

        transaction.commit();
        return AppSuccess<IMessage>({ data: { message: 'Generated verification code successfully!' } });
    } catch (error) {
        transaction.rollback();
        throw error;
    }
};

/**
 * user verification service
 * @param { Request } request - Request object
 * @returns { Promise<Success<SendData<IMessage>> | Errors> }
 */
export const postUserVerificationService = async (request: Request): Promise<Success<SendData<IMessage>> | Errors> => {
    try {
        interface UserParams {
            verifyCode: number;
        }

        const { verifyCode } = request.params as unknown as UserParams;

        if (!verifyCode) {
            throw AppError(request.path, 400, 'E4003', ['The verification code is required!'], ['verifyCode'], []);
        }

        // get variables in request
        const user = request.user as IUserInformation;

        // check verification information
        if (user.verify === 1) {
            throw AppError(request.path, 400, 'E4002', ['The user already authenticated!'], [], []);
        }

        const verificationInfo = await selectVerifcationInformation({ userId: user.userId });

        if (verificationInfo.length != 1) {
            throw AppError(request.path, 403, 'E4004', ['No authentication information found!'], [], []);
        }

        if (verificationInfo[0].verifyCodeExpiration < getCurrentTimeAt()) {
            throw AppError(request.path, 400, 'E4005', ['The verification code has expired!'], [], []);
        }

        if (Number(verificationInfo[0].verifyCode) !== Number(verifyCode)) {
            throw AppError(request.path, 400, 'E4006', ['The verification code is incorrect!'], ['verifyCode'], []);
        }

        // create transaction
        const transaction = await createTransaction();

        // update user verification
        const [updatedUser, errorUpdatedUser] = await updateUserVerification(transaction, { userId: user.userId, currentTime: getCurrentTimeAt() });

        // check error when update verification code
        if (errorUpdatedUser) {
            // rollback transaction
            transaction.rollback();
            throw AppError(request.path, 400, 'E8003', ['Error when user verification!'], [], [errorUpdatedUser]);
        }

        // commit transaction
        transaction.commit();

        return AppSuccess<IMessage>({ data: { message: 'Verification successful' } });
    } catch (error) {
        throw error;
    }
};

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
