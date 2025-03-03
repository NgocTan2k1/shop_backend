export interface insertNewUserSchema {
    userId: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
    currentTime: number;
}

export interface insertNewUserRoleSchema {
    userId: string;
    roleId: number;
    currentTime: number;
}

export interface updateNewVerifyCodeSchema {
    userId: string;
    verifyCode: number;
    verifyCodeExpiration: number;
    currentTime: number;
}

export interface selectVerifcationInformationSchema {
    userId: string;
}

export interface updateUserVerificationSchema {
    userId: string;
    currentTime: number;
}
