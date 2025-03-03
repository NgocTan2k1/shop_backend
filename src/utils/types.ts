// libs
import express from 'express';

// interfaces
import { IUserInformation } from './interfaces';

declare global {
    namespace Express {
        interface Request {
            user?: IUserInformation;
        }
    }
}

/* ========== Error Handlers ==========*/
// error details
export type ErrorDetail = {
    nameError: string;
    params: string[];
    errorMessage: string;
};

// success responses
export type Success<SendData> = {
    result: SendData;
};

// data response
export type SendData<T> = {
    data?: T;
};

// errors
export type Errors = {
    apiName: string;
    statusCode: number;
    errorCode: string;
    errorMessage: string[];
    errorParams?: string[];
    errorDetails?: ErrorDetail[];
};

/* ========== Constants ==========*/
// api name
export type ApiName = {
    [key: string]: string;
};
