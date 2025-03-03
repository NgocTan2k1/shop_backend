// libs
import { Connection } from 'mysql';

// models
import { insertNewUserSchema, selectVerifcationInformationSchema, updateNewVerifyCodeSchema, updateUserVerificationSchema } from './models';

// utils
import { queryPromise, queryPromiseTransaction } from '../utils/database';
import { IUserInformation, IVerificationInformation } from '../utils/interfaces';

/**
 * select user who is signing in
 * @param username : the username
 * @param password : the password
 * @returns
 */
export const selectUserLogin = async (username: string, password: string): Promise<IUserInformation[] | []> => {
    try {
        const query = `
            SELECT 
                USER_ID AS userId,
                USER_FIRST_NAME AS firstName,
                USER_LAST_NAME AS lastName,
                USER_NAME AS username,
                USER_PASSWORD AS password,
                USER_EMAIL AS email,
                USER_PHONE_NUMBER AS phoneNumber,
                USER_ADDRESS AS address,
                USER_DELETE_FLG AS deleteFlg,
                USER_VERIFY AS verify,
                USER_CREATED_AT AS createdAt,
                USER_UPDATED_AT AS updatedAt
            FROM 
                M_USERS
            WHERE 
                USER_NAME = ? AND USER_PASSWORD = SHA2(?, 256) AND USER_DELETE_FLG = 0;
        `;

        const result = await queryPromise<IUserInformation[]>(query, [username, password]);

        // No record found
        if (result.length === 0) return [];

        // Return the result
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        // TODO
        console.error(error);
        throw error;
    }
};

/**
 * select user by userId
 * @param userId : the userId
 * @returns {IUserInformation[] | []} : the user information
 */
export const selectUserById = async (userId: string): Promise<IUserInformation[] | []> => {
    try {
        const query = `
            SELECT 
                USER_ID AS userId,
                USER_FIRST_NAME AS firstName,
                USER_LAST_NAME AS lastName,
                USER_NAME AS username,
                USER_PASSWORD AS password,
                USER_EMAIL AS email,
                USER_PHONE_NUMBER AS phoneNumber,
                USER_ADDRESS AS address,
                USER_DELETE_FLG AS deleteFlg,
                USER_VERIFY AS verify,
                USER_CREATED_AT AS createdAt,
                USER_UPDATED_AT AS updatedAt
            FROM 
                M_USERS
            WHERE 
                USER_ID = ? AND USER_DELETE_FLG = 0
        `;

        const result = await queryPromise<IUserInformation[]>(query, [userId]);

        // No record found
        if (result.length === 0) return [];

        // Return the result
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        // TODO
        console.error(error);
        throw error;
    }
};

/**
 * insert new user
 * @param transaction {Connection} : the transaction
 * @param userInfo {IBodyPostSignUpService} : the user information
 * @returns
 */
export const insertNewUser = async (transaction: Connection, userInfo: insertNewUserSchema): Promise<[success: any, error: any]> => {
    try {
        const query = `
            INSERT INTO M_USERS (
                USER_ID,
                USER_FIRST_NAME,
                USER_LAST_NAME,
                USER_NAME,
                USER_EMAIL,
                USER_PASSWORD,
                USER_PHONE_NUMBER,
                USER_ADDRESS,
                USER_DELETE_FLG,
                USER_VERIFY,
                USER_VERIFY_CODE,
                USER_VERIFY_CODE_EXPIRATION,
                USER_CREATED_BY,
                USER_CREATED_AT,
                USER_CREATED_AT_SYSTEM,
                USER_UPDATED_BY,
                USER_UPDATED_AT,
                USER_UPDATED_AT_SYSTEM
            ) 
            VALUES (?, ?, ?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'), ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'));
        `;

        const values = [
            userInfo.userId,
            userInfo.firstname,
            userInfo.lastname,
            userInfo.username,
            userInfo.email,
            userInfo.password,
            userInfo.phoneNumber,
            userInfo.address,
            0,
            0,
            null,
            null,
            'USER',
            userInfo.currentTime,
            userInfo.currentTime,
            'USER',
            userInfo.currentTime,
            userInfo.currentTime,
        ];

        const result = transaction ? await queryPromiseTransaction(transaction, query, values) : await queryPromise<any>(query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * update user verification
 * @param transaction {Connection} : the transaction
 * @param userId {string} : the userId
 * @param verifyCode {string} : the verify code
 * @param currentTime {number} : the current time
 * @returns
 */
export const updateNewVerifyCode = async (transaction: Connection, updateInfo: updateNewVerifyCodeSchema): Promise<[success: any, error: any]> => {
    try {
        const query = `
            UPDATE M_USERS
            SET
                USER_VERIFY_CODE = ?,
                USER_VERIFY_CODE_EXPIRATION = ?,
                USER_UPDATED_BY = 'USER',
                USER_UPDATED_AT = ?,
                USER_UPDATED_AT_SYSTEM = DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s')
            WHERE
                USER_ID = ? AND USER_DELETE_FLG = 0;
        `;

        const values = [updateInfo.verifyCode, updateInfo.verifyCodeExpiration, updateInfo.currentTime, updateInfo.currentTime, updateInfo.userId];

        const result = transaction ? await queryPromiseTransaction(transaction, query, values) : await queryPromise<any>(query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * select verification information
 * @param { string } userId: the userId
 * @returns { Promise<IVerificationInformation[] | []> } : the verification information
 */
export const selectVerifcationInformation = async ({ userId }: selectVerifcationInformationSchema): Promise<IVerificationInformation[] | []> => {
    try {
        const query = `
            SELECT 
                USER_VERIFY AS verify,
                USER_VERIFY_CODE AS verifyCode,
                USER_VERIFY_CODE_EXPIRATION AS verifyCodeExpiration
            FROM 
                M_USERS
            WHERE 
                USER_ID = ? AND USER_DELETE_FLG = 0;
        `;

        const result = await queryPromise<IVerificationInformation[]>(query, [userId]);

        // No record found
        if (result.length === 0) return [];

        // Return the result
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        // TODO
        console.error(error);
        throw error;
    }
};

/**
 * update user verification
 * @param updateInfo : the update information
 * @returns {Promise<[success: any, error: any]>} : the result
 */
export const updateUserVerification = async (transaction: Connection, updateInfo: updateUserVerificationSchema): Promise<[success: any, error: any]> => {
    try {
        const query = `
            UPDATE M_USERS
            SET
                USER_VERIFY = 1,
                USER_UPDATED_BY = 'USER',
                USER_UPDATED_AT = ?,
                USER_UPDATED_AT_SYSTEM = DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s')
            WHERE
                USER_ID = ? AND USER_DELETE_FLG = 0;
        `;

        const values = [updateInfo.currentTime, updateInfo.currentTime, updateInfo.userId];

        const result = transaction ? await queryPromiseTransaction<any>(transaction, query, values) : await queryPromise<any>(query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};
