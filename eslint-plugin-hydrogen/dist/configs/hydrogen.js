"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    plugins: ['hydrogen'],
    rules: {
        'hydrogen/server-component-banned-hooks': 'error',
        'hydrogen/client-component-banned-hooks': 'error',
        'hydrogen/prefer-image-component': 'error',
    },
};
