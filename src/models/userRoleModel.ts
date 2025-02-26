import { Connection } from 'mysql';
import { queryPromise, queryPromiseTransaction } from '../utils/database';
import { IBodyPostSignUpService, IUserInformation } from '../utils/interfaces';
import { insertNewUserRoleSchema } from './models';

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
            VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [insertInfo.roleId, insertInfo.userId, 0, 'SYSTEM', Date.now(), Date.now(), 'SYSTEM', Date.now(), Date.now()];

        const result = transaction ? await queryPromise<any>(query, values) : queryPromiseTransaction(transaction, query, values);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
};
