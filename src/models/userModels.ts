import { queryPromise } from '../utils/database';
import { IUserInformation } from '../utils/interfaces';

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
