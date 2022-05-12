export function sendMessageToClient(message) {
    // @ts-ignore
    const devServer = globalThis.__viteDevServer;
    if (devServer) {
        devServer.ws.send({
            type: 'custom',
            event: 'hydrogen',
            data: message,
        });
    }
}
