// libs
import { Request, Response, NextFunction } from 'express';

// utils
import logger from '../utils/logger';
import { Errors } from '../utils/types';

/**
 * Sign up controller
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
const errorHandler = async (error: Errors, request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('error-try:', error);

        const apiName = error.apiName || '';
        const statusCode = error.statusCode || 500;
        const errorCode = error.errorCode || 'E9999';
        const errorMessage = error.errorMessage;
        const errorParams = error.errorParams;
        const errorDetails = error.errorDetails;

        logger.error(errorMessage.toString(), { status: 'end', method: request.method, apiName: request.path });
        response.status(statusCode).send({
            apiName,
            errorCode,
            errorMessage,
            errorParams,
            errorDetails,
        });
    } catch (error: any) {
        console.log('error-catch:', error);
        response.status(400).send({
            apiName: 'errorHandler',
            errorCode: 'E9999',
            errorMessage: 'Error in error handler',
            errorParams: [''],
            errorDetails: [error.message],
        });
        return;
    }
};

export default errorHandler;
