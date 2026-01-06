export interface IUser {
    name?: string;
    phone?: string;
    user_id?: string;
}

export interface IToken {
    access: string;
}

export interface IVerifyResponse {
    otp: string;
    token: IToken;
    user: boolean;
}

export interface ILoginRegisterResponse {
    token: IToken;
    user_id: string;
    name: string;
    phone_number: string;
    message: string;
}
