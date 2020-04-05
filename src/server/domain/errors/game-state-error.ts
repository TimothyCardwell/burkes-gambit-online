export class GameStateError extends Error {
    name: string = "GameStateError";
    message: string;
    timestamp: Date;
    stack: string;

    constructor(message: string, stack?: string) {
        super(message);
        this.stack = stack;
        this.timestamp = new Date();
    }
}