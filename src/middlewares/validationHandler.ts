import { NextFunction, Request, Response } from 'express';
import { AppError } from './responseHandler';
import { UserSignUpSchema } from '../utils/validation';
import { ZodError } from 'zod';
import { parseValidationErrors } from '../utils/common';
import { IBodyPostSignUpService } from '../utils/interfaces';

/**
 * sign up validation middleware
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const signUpHandler = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        // interfaces body
        interface UserBody extends IBodyPostSignUpService {}

        // get variables in body
        const userInfo = request.body as unknown as UserBody;

        // validate body
        UserSignUpSchema.parse(userInfo);

        // check confirm password
        if (userInfo.password !== userInfo.confirmPassword) {
            return next(AppError(request.path, 400, 'E0414', ['Password and confirm password do not match'], ['confirmPassword']));
        }

        return next();
    } catch (errors: any) {
        // parse validation errors
        errors = errors as ZodError;

        // get error details
        const { params, messages } = parseValidationErrors(errors.issues);

        // create error
        const error = AppError(request.path, 400, 'E0700', messages, params);

        // call error handlers
        return next(error);
    }
};
