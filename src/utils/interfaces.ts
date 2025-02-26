// User Service

export interface IUserInformation {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
    deleteFlg: number;
    createdAt: number;
    updatedAt: number;
}

export interface IGetSignInService {
    userId: string;
    token: string;
    refreshToken: string;
}

export interface IPostSignUpService {
    message: string;
}
export interface IBodyPostSignUpService {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phoneNumber: string;
    address: string;
    role?: number;
}
