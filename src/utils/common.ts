import { ZodIssue } from 'zod';

export const parseValidationErrors = (errors: ZodIssue[]) => {
    const params: string[] = [];
    const messages: string[] = [];

    errors.forEach((error: ZodIssue) => {
        params.push(String(error?.path[0]) || '');
        messages.push(error.message);
    });

    return { params, messages };
};
/**
 * get current time at
 * @param skipTime the time to skip(minutes)
 * @returns
 */
export const getCurrentTimeAt = (skipTime = 0) => {
    return new Date().getTime() + skipTime * 60000;
};
