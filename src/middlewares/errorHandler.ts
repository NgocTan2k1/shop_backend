// libs
import { Request, Response, NextFunction } from 'express';

// utils
import logger from '../utils/logger';

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    try {
        console.log('error:', error);

        logger.error(error.message, { status: 'end', method: request.method, apiName: request.path });
        response.status(500).send(error.message);
        return;
    } catch (error) {
        return;
    }
};

export default errorHandler;
