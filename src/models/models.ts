export interface insertNewUserSchema {
    userId: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface insertNewUserRoleSchema {
    userId: string;
    roleId: number;
}
