import { ActionBase } from './action/base';
export declare type Levels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
export interface ConfigMessage {
    type: 'config';
    prop: string;
    value: any;
}
export declare class Config {
    outputLevel: Levels;
    action: ActionBase;
    prideAction: ActionBase;
    errorsHandled: boolean;
    showStackTrace: boolean;
    get debug(): boolean;
    set debug(v: boolean);
    get context(): any;
    set context(v: any);
}
export declare const config: Config;
export default config;
