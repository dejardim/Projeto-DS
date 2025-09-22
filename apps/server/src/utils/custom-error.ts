export class CustomError extends Error {
    message!: string;
    status: number;
    data?: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super();
        this.message = message;
        this.status = status;
        this.data = data;
    }
}
