import { NextFunction, Request, Response } from 'express';
import logger from './logger';

interface AsyncFunction {
    (request: Request, response: Response, next: NextFunction): Promise<void>;
}

export const catchAsync = (fn: AsyncFunction) => (request: Request, response: Response, next: NextFunction) => {
    logger.info('', {
        status: 'start',
        method: request.method,
        apiName: request.path,
        Parmas: request.params,
        Queries: request.query,
        Bodies: request.body,
    });
    fn(request, response, next).catch((error) => next(error));
};
