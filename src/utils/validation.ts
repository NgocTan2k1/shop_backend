import { z } from 'zod';

export const UserSignUpSchema = z.object({
    firstname: z
        .string({
            required_error: 'Firstname is required',
            invalid_type_error: 'First Name must be a string',
        })
        .min(1, {
            message: 'Firstname must be than 1 characters',
        })
        .max(12, {
            message: 'Firstname must be less than 12 characters',
        }),
    lastname: z
        .string({
            required_error: 'Lastname is required',
            invalid_type_error: 'Lastname must be a string',
        })
        .min(1, {
            message: 'Lastname must be than 1 characters',
        })
        .max(36, {
            message: 'Lastname must be less than 36 characters',
        }),
    username: z
        .string({
            required_error: 'Username is required',
            invalid_type_error: 'Username must be a string',
        })
        .min(5, {
            message: 'Username must be more than 5 characters',
        })
        .max(20, {
            message: 'Username must be less than 20 characters',
        }),

    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .email({
            message: 'Email must be a valid email',
        })
        .max(64, {
            message: 'Email must be less than 64 characters',
        }),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
            message: 'Password must be a string',
        })
        .min(8, {
            message: 'Password must be more than 8 characters',
        })
        .max(20, {
            message: 'Password must be less than 20 characters',
        }),
    phoneNumber: z
        .string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone number must be a string',
            message: 'Phone number must be a string',
        })
        .min(10, {
            message: 'Phone number must be more than 10 characters',
        })
        .max(10, {
            message: 'Phone number must be less than 10 characters',
        }),
    address: z
        .string({
            required_error: 'Address is required',
            invalid_type_error: 'Address must be a string',
            message: 'Address must be a string',
        })
        .min(10, {
            message: 'Address must be more than 10 characters',
        })
        .max(64, {
            message: 'Address must be less than 64 characters',
        }),
});
