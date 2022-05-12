declare const _default: {
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
export default _default;
