"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocket = void 0;
var WebSocketSubject_1 = require("./WebSocketSubject");
function webSocket(urlConfigOrSource) {
    return new WebSocketSubject_1.WebSocketSubject(urlConfigOrSource);
}
exports.webSocket = webSocket;
//# sourceMappingURL=webSocket.js.map