"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const client_component_banned_hooks_1 = require("./client-component-banned-hooks");
const server_component_banned_hooks_1 = require("./server-component-banned-hooks");
const prefer_image_component_1 = require("./prefer-image-component");
exports.rules = {
    'client-component-banned-hooks': client_component_banned_hooks_1.clientComponentBannedHooks,
    'server-component-banned-hooks': server_component_banned_hooks_1.serverComponentBannedHooks,
    'prefer-image-component': prefer_image_component_1.preferImageComponent,
};
