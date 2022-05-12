import { Interfaces } from '@oclif/core';
import Yarn from './yarn';
export default class Plugins {
    config: Interfaces.Config;
    verbose: boolean;
    readonly yarn: Yarn;
    private readonly debug;
    constructor(config: Interfaces.Config);
    pjson(): Promise<Interfaces.PJSON.User>;
    list(): Promise<(Interfaces.PJSON.PluginTypes.User | Interfaces.PJSON.PluginTypes.Link)[]>;
    install(name: string, { tag, force }?: {
        tag?: string | undefined;
        force?: boolean | undefined;
    }): Promise<Interfaces.Config>;
    refresh(root: string, { prod }?: {
        prod?: boolean;
    }): Promise<void>;
    link(p: string): Promise<void>;
    add(plugin: Interfaces.PJSON.PluginTypes): Promise<void>;
    remove(name: string): Promise<void>;
    uninstall(name: string): Promise<void>;
    update(): Promise<void>;
    hasPlugin(name: string): Promise<Interfaces.PJSON.PluginTypes.Link | Interfaces.PJSON.User | boolean>;
    yarnNodeVersion(): Promise<string | undefined>;
    unfriendlyName(name: string): string | undefined;
    maybeUnfriendlyName(name: string): Promise<string>;
    friendlyName(name: string): string;
    private createPJSON;
    private get pjsonPath();
    private get npmRegistry();
    private npmHasPackage;
    private savePJSON;
    private normalizePlugins;
}
