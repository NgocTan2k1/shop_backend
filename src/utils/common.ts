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
