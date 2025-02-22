// libs
import { Request } from 'express';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// models
import { selectUserById } from '../models/userModels';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IUserInformation } from '../utils/interfaces';

const getUserInformationService = async (request: Request): Promise<Success<SendData<IUserInformation>> | Errors> => {
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
        if (users.length != 1) throw AppError(request.path, 400, 'E0001', 'Bad request!!!', ['userId']);

        // get user information
        const user = users[0];
        return AppSuccess<IUserInformation>({ data: user });
    } catch (error) {
        // TODO
        throw error;
    }
};

export { getUserInformationService };
