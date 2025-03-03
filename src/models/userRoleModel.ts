// libs
import { Connection } from 'mysql';

// models
import { insertNewUserRoleSchema } from './models';

// utils
import { queryPromise, queryPromiseTransaction } from '../utils/database';

/**
 * insert new user role
 * @param {Connection} transaction - the transaction
 * @param {IBodyPostSignUpService} userInfo - the user information
 * @returns Promise<[success: any, error: any]>
 */
export const insertNewUserRole = async (
    transaction: Connection,
    insertInfo: insertNewUserRoleSchema
): Promise<[success: any, error: any]> => {
    try {
        const query = `
            INSERT INTO R_USERS_ROLES (
                USER_ID,
                ROLE_ID,
                DELETE_FLG,
                CREATED_BY,
                CREATED_AT,
                CREATED_AT_SYSTEM,
                UPDATED_BY,
                UPDATED_AT,
                UPDATED_AT_SYSTEM
            ) 
            VALUES  (?, ?, ?, ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'), ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'));
        `;

        const values = [
            insertInfo.userId,
            insertInfo.roleId,
            0,
            'SYSTEM',
            insertInfo.currentTime,
            insertInfo.currentTime,
            'SYSTEM',
            insertInfo.currentTime,
            insertInfo.currentTime,
        ];

        const result = transaction ? await queryPromiseTransaction(transaction, query, values) : await queryPromise<any>(query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};
