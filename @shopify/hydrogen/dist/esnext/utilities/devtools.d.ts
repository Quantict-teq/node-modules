export declare type DevServerMessage = {
    type: 'warn';
    data: string;
} | {
    type: 'error';
    data: {
        message: string;
        stack: string;
    };
};
export declare function sendMessageToClient(message: DevServerMessage): void;
