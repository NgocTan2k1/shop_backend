// libs
import { Request } from 'express';

// middlewares
import { AppError, AppSuccess } from '../middlewares/responseHandler';

// utils
import { Errors, SendData, Success } from '../utils/types';
import { IGetUserInformationService } from '../utils/interfaces';

const getUserInformationService = async (request: Request): Promise<Success<SendData<IGetUserInformationService>> | Errors> => {
    interface UserQuery {
        userId: number;
    }
    const { userId } = request.query as unknown as UserQuery;
    if (userId % 2 !== 0) return AppSuccess<IGetUserInformationService>({ data: { userId: 123 } });
    throw AppError(request.path, 400, 'E0001', 'Bad request!!!', ['userId']);
};

export { getUserInformationService };
