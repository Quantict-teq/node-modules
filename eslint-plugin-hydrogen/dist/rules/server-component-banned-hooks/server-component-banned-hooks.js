"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverComponentBannedHooks = void 0;
const utilities_1 = require("../../utilities");
const BANNED_STATE_HOOKS = ['useState', 'useReducer'];
const BANNED_EFFECT_HOOKS = ['useEffect', 'useLayoutEffect'];
const BANNED_HOOKS = [...BANNED_STATE_HOOKS, ...BANNED_EFFECT_HOOKS];
exports.serverComponentBannedHooks = (0, utilities_1.createRule)({
    name: `hydrogen/${__dirname}`,
    meta: {
        type: 'problem',
        docs: {
            //@ts-expect-error
            description: `Prevents ${new Intl.ListFormat('en').format(BANNED_HOOKS)} in React Server Components`,
            category: 'Possible Errors',
            recommended: 'error',
        },
        messages: {
            serverComponentBannedHooks: `Do not use {{hook}} in React Server Components.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        return {
            CallExpression(node) {
                const hook = (0, utilities_1.getHookName)(node);
                if ((0, utilities_1.isServerComponent)(context.getFilename()) &&
                    (0, utilities_1.isHook)(node) &&
                    BANNED_HOOKS.includes(hook)) {
                    context.report({
                        node,
                        data: { hook },
                        messageId: 'serverComponentBannedHooks',
                    });
                }
            },
        };
    },
});
