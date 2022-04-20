export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    isVerfied: boolean;
    confirmationCode: string;
    profilePicture: string;
}