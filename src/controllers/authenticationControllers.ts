// libs
import { Request, Response, NextFunction } from 'express';

// services
import { getSignInService, getRefreshTokenService } from '../services/authenticationServices';

// utils
import logger from '../utils/logger';
import { catchAsync } from '../utils/catchAsync';

// ===== Ver1.0.0 =====
/**
 * Get sign in controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const getSignIn = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getSignInService(request);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
    return;
});

// ===== Ver1.0.0 =====
/**
 * Get refresh token controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 */
export const getRefreshToken = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const result = await getRefreshTokenService(request, next);

    logger.info(JSON.stringify(result), { status: 'end', method: request.method, apiName: request.path });

    response.status(200).send(result);
    return;
});
