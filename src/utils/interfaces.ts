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
