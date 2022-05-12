import { TSESTree } from '@typescript-eslint/types';
export declare function isServerComponent(filename: string): boolean;
export declare function isClientComponent(filename: string): boolean;
export declare function isHook(node: TSESTree.CallExpression): boolean;
export declare function getHookName(node: TSESTree.CallExpression): string;
