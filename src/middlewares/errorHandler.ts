// libs
import { Request, Response, NextFunction } from 'express';

// utils
import logger from '../utils/logger';
import { Errors } from '../utils/types';

const errorHandler = (error: Errors, request: Request, response: Response, next: NextFunction) => {
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
    } catch (error) {
        console.log('error-catch:', error);
        return;
    }
};

export default errorHandler;
