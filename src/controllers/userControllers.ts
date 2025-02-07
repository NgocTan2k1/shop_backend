// libs
import { Request, Response, NextFunction } from 'express';

// services
import { getUserInformationService } from '../services/userServices';

// utils
import logger from '../utils/logger';
import { apiName } from '../utils/constant';
import { catchAsync } from '../utils/catchAsync';

const getUserInformationController = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getUserInformationService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});

export { getUserInformationController };
