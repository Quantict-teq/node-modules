"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientComponentBannedHooks = void 0;
const utilities_1 = require("../../utilities");
const BANNED_HOOKS = ['useQuery', 'useShopQuery'];
exports.clientComponentBannedHooks = (0, utilities_1.createRule)({
    name: `hydrogen/${__dirname}`,
    meta: {
        type: 'problem',
        docs: {
            //@ts-expect-error
            description: `Prevents ${new Intl.ListFormat('en').format(BANNED_HOOKS)} in React Client Components`,
            category: 'Possible Errors',
            recommended: 'error',
        },
        messages: {
            clientComponentBannedHooks: `Do not use {{hook}} in React Client Components.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        return {
            CallExpression(node) {
                const hook = (0, utilities_1.getHookName)(node);
                if ((0, utilities_1.isClientComponent)(context.getFilename()) &&
                    (0, utilities_1.isHook)(node) &&
                    BANNED_HOOKS.includes(hook)) {
                    context.report({
                        node,
                        data: { hook },
                        messageId: 'clientComponentBannedHooks',
                    });
                }
            },
        };
    },
});
