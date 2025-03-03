// libs
import { Request, Response, NextFunction } from 'express';

// services
import { getUserInformationService, getUserVerificationService, postSignUpService, postUserVerificationService } from '../services/userServices';

// utils
import logger from '../utils/logger';
import { catchAsync } from '../utils/catchAsync';

/**
 * Sign up controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const postSignUpController = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await postSignUpService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(201).send(result);
});

/**
 * Get User verification controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const getUserVerificationController = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getUserVerificationService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(201).send(result);
});

/**
 * Post User verification controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const postUserVerificationController = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await postUserVerificationService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});

/**
 * Get user information controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const getUserInformationController = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getUserInformationService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
});
