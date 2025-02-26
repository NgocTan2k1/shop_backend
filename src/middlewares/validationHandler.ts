import { NextFunction, Request, Response } from 'express';
import { AppError } from './responseHandler';
import { UserSignUpSchema } from '../utils/validation';
import { ZodError } from 'zod';
import { parseValidationErrors } from '../utils/common';
import { IBodyPostSignUpService } from '../utils/interfaces';

export const signUpHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // interfaces body
        interface UserBody extends IBodyPostSignUpService {}

        // get variables in body
        const userInfo = request.body as unknown as UserBody;

        // validate body
        UserSignUpSchema.parse(userInfo);

        // check confirm password
        if (userInfo.password !== userInfo.confirmPassword) {
            return next(AppError(request.path, 400, 'E0001', ['Password and confirm password do not match'], ['confirmPassword']));
        }

        return next();
    } catch (errors: any) {
        // parse validation errors
        errors = errors as ZodError;

        // get error details
        const { params, messages } = parseValidationErrors(errors.issues);

        // create error
        const error = AppError(request.path, 400, 'E0001', messages, params);

        // call error handlers
        return next(error);
    }
};
