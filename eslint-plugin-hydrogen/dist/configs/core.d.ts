declare const _default: {
    extends: string[];
    plugins: string[];
    env: {
        es2021: boolean;
        browser: boolean;
        node: boolean;
    };
    settings: {
        react: {
            version: string;
        };
    };
    parserOptions: {
        ecmaFeatures: {
            jsx: boolean;
        };
        sourceType: string;
    };
    rules: {
        'no-console': string;
        'eslint-comments/no-unused-disable': string;
        'object-shorthand': (string | {
            avoidQuotes: boolean;
        })[];
        'react/display-name': string;
        'react/prop-types': string;
        'react/no-array-index-key': string;
        'react/react-in-jsx-scope': string;
        '@shopify/jsx-no-hardcoded-content': string;
        '@shopify/jsx-no-complex-expressions': string;
        'no-use-before-define': string;
        'no-warning-comments': string;
        'jsx-a11y/label-has-for': string;
        'jsx-a11y/control-has-associated-label': string;
    };
    ignorePatterns: string[];
    overrides: {
        files: string[];
        plugins: string[];
        extends: string[];
        env: {
            node: boolean;
            jest: boolean;
        };
    }[];
};
export default _default;
