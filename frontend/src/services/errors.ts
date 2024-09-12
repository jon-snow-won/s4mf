export class AuthError extends Error {
    public status: number

    constructor({ status: authErrStatus, message }: { status: number; message: string }) {
        super(message)

        this.status = authErrStatus
    }
}

export class ApiError extends Error {
    public status: number

    constructor({ status: apiErrStatus, message }: { status: number; message: string }) {
        super(message)

        this.status = apiErrStatus
    }
}
