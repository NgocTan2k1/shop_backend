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
