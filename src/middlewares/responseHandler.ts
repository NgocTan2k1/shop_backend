import { ErrorDetail, Errors, SendData, Success } from '../utils/types';

export interface IAppSuccess<T> {
    data: T;
}

export const AppSuccess = <T>({ data }: IAppSuccess<T>): Success<SendData<T>> => ({
    result: {
        data,
    },
});

export const AppError = (
    apiName: string,
    statusCode: number,
    errorCode: string,
    errorMessage: string,
    errorParams?: string[],
    errorDetails?: ErrorDetail[]
): Errors => ({
    apiName,
    statusCode,
    errorCode,
    errorMessage,
    errorParams,
    errorDetails,
});
