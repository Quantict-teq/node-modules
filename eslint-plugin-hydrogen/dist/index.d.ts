export { rules } from './rules';
export declare const configs: {
    recommended: {
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
    } & {
        plugins: string[];
        rules: {
            'hydrogen/server-component-banned-hooks': string;
            'hydrogen/client-component-banned-hooks': string;
            'hydrogen/prefer-image-component': string;
        };
    };
    hydrogen: {
        plugins: string[];
        rules: {
            'hydrogen/server-component-banned-hooks': string;
            'hydrogen/client-component-banned-hooks': string;
            'hydrogen/prefer-image-component': string;
        };
    };
    typescript: {
        overrides: {
            files: string[];
            parser: string;
            extends: string[];
            rules: {
                'react/prop-types': string;
                '@typescript-eslint/no-empty-function': string;
                '@typescript-eslint/no-explicit-any': string;
                '@typescript-eslint/no-non-null-assertion': string;
                '@typescript-eslint/explicit-module-boundary-types': string;
                '@typescript-eslint/no-unused-vars': string;
                '@typescript-eslint/no-empty-interface': string;
                '@typescript-eslint/naming-convention': (string | {
                    selector: string;
                    format: string[];
                    leadingUnderscore: string;
                    trailingUnderscore: string;
                } | {
                    selector: string;
                    format: string[];
                    leadingUnderscore?: undefined;
                    trailingUnderscore?: undefined;
                } | {
                    selector: string;
                    format: string[];
                    leadingUnderscore: string;
                    trailingUnderscore?: undefined;
                })[];
            };
        }[];
    };
};
