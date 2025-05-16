type GeneralResponse = {
    status: string,
    message?: string,
}

type AuthResponse = GeneralResponse & {
    userID?: number,
    error: {
        input: string
    }[]
}

type Register = {
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    type: string,
    upline: string
}

type Login = {
    email: string,
    password: string
    type: string
}