import { FlagUsageOptions, Flag } from '../interfaces';
export declare function flagUsage(flag: Flag<any>, options?: FlagUsageOptions): [string, string | undefined];
export declare function flagUsages(flags: Flag<any>[], options?: FlagUsageOptions): [string, string | undefined][];
