// libs
import { Request, Response, NextFunction } from 'express';

// services
import { getUserInformationService, postSignUpService } from '../services/userServices';

// utils
import logger from '../utils/logger';
import { catchAsync } from '../utils/catchAsync';

/**
 * Get user information
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const getUserInformation = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getUserInformationService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});

/**
 * Sign up controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const postSignUp = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await postSignUpService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});

/**
 * User verification controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const postUserVerification = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await postSignUpService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});
