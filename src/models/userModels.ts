import { Connection } from 'mysql';
import { queryPromise, queryPromiseTransaction } from '../utils/database';
import { IBodyPostSignUpService, IUserInformation } from '../utils/interfaces';
import { insertNewUserSchema } from './models';

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
                USER_CREATED_AT AS createdAt,
                USER_UPDATED_AT AS updatedAt
            FROM 
                M_USERS
            WHERE 
                USER_NAME = ? AND USER_PASSWORD = ? AND USER_DELETE_FLG = 0
                -- USER_NAME = ? AND USER_PASSWORD = SHA2(? , 256);
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
 * @returns
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
                USER_VERIFY_TOKEN,
                USER_TOKEN_EXPIRATION,
                USER_CREATED_BY,
                USER_CREATED_AT,
                USER_CREATED_AT_SYSTEM,
                USER_UPDATED_BY,
                USER_UPDATED_AT,
                USER_UPDATED_AT_SYSTEM
            ) 
            VALUES (uuid, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            'test',
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
            Date.now(),
            Date.now(),
            'USER',
            Date.now(),
            Date.now(),
        ];

        const result = transaction ? await queryPromise<any>(query, values) : queryPromiseTransaction(transaction, query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};
