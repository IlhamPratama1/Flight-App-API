export interface signinInterface {
    email: string,
    password: string
}

export interface signupInterface {
    username: string,
    email: string,
    password: string
}

export interface getRefreshInterface {
    refreshToken: string
}

export interface DataStoredInToken {
    id: number;
}

export interface DataStoredInTokenForget {
    email: number;
}
  