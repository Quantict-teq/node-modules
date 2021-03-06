import { Awaitable as Awaitable_2 } from '@miniflare/shared';

export declare function addAll<T>(set: Set<T>, values: Iterable<T>): void;

export declare type AdditionalModules = {
    [key: string]: Context;
};

export declare function assertInRequest(): void;

export declare type Awaitable<T> = T | Promise<T>;

export declare function base64Decode(encoded: string): string;

export declare function base64Encode(value: string): string;

export declare interface BeforeSetupResult {
    watch?: string[];
}

export declare type Clock = () => number;

export declare class Compatibility {
    #private;
    private compatibilityDate;
    private compatibilityFlags;
    constructor(compatibilityDate?: string, compatibilityFlags?: CompatibilityFlag[]);
    isEnabled(flag: CompatibilityEnableFlag): boolean;
    update(compatibilityDate?: string, compatibilityFlags?: CompatibilityFlag[]): boolean;
    get enabled(): CompatibilityEnableFlag[];
}

export declare type CompatibilityDisableFlag = "durable_object_fetch_allows_relative_url" | "fetch_treats_unknown_protocols_as_http" | "formdata_parser_converts_files_to_strings";

export declare type CompatibilityEnableFlag = "durable_object_fetch_requires_full_url" | "fetch_refuses_unknown_protocols" | "formdata_parser_supports_files" | "html_rewriter_treats_esi_include_as_void_tag";

export declare interface CompatibilityFeature {
    defaultAsOf?: string;
    enableFlag: CompatibilityEnableFlag;
    disableFlag?: CompatibilityDisableFlag;
}

export declare type CompatibilityFlag = CompatibilityEnableFlag | CompatibilityDisableFlag;

export declare type Context = {
    [key: string | symbol]: any;
};

export declare const defaultClock: Clock;

export declare type ExtractOptions<Instance> = Instance extends Plugin<infer Options> ? Options : never;

export declare function getRequestContext(): RequestContext | undefined;

export declare function globsToMatcher(globs?: string[]): Matcher;

export declare class InputGate {
    #private;
    constructor(parent?: InputGate);
    /** Waits for input gate to open, then runs closure under the input gate */
    runWith<T>(closure: () => Awaitable<T>): Promise<T>;
    /** Waits for input gate to be open (e.g. before returning from async I/O) */
    waitForOpen(): Promise<void>;
    /**
     * Runs a closure with this input gate closed (e.g. performing Durable Object
     * storage operation, blockConcurrencyWhile). Once complete, if the gate is
     * now open, resolves some waiters.
     */
    runWithClosed<T>(closure: () => Promise<T>): Promise<T>;
}

export declare class InputGatedEventTarget<EventMap extends Record<string, Event>> extends TypedEventTarget<EventMap> {
    protected [kWrapListener]<Type extends keyof EventMap>(listener: (event: EventMap[Type]) => void): (event: EventMap[Type]) => void;
}

export declare function kebabCase(s: string): string;

export declare const kWrapListener: unique symbol;

export declare class Log {
    #private;
    readonly level: LogLevel;
    constructor(level?: LogLevel, opts?: LogOptions);
    log(message: string): void;
    logWithLevel(level: LogLevel, message: string): void;
    error(message: Error): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}

export declare enum LogLevel {
    NONE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    VERBOSE = 5
}

export declare interface LogOptions {
    prefix?: string;
    suffix?: string;
}

export declare function logOptions<Plugins extends PluginSignatures>(plugins: PluginEntries<Plugins>, log: Log, options: PluginOptions<Plugins>): void;

export declare interface Matcher {
    test(string: string): boolean;
    toString(): string;
}

export declare function millisToSeconds(millis: number): number;

export declare abstract class MiniflareError<Code extends string | number = string | number> extends Error {
    readonly code: Code;
    readonly cause?: Error | undefined;
    constructor(code: Code, message?: string, cause?: Error | undefined);
}

export declare interface ModuleRule {
    type: ModuleRuleType;
    include: string[];
    fallthrough?: boolean;
}

export declare type ModuleRuleType = "ESModule" | "CommonJS" | "Text" | "Data" | "CompiledWasm";

export declare interface Mount<Request = any, Response = any> {
    moduleExports?: Context;
    dispatchFetch?: (request: Request) => Promise<Response>;
}

export declare class Mutex {
    private locked;
    private resolveQueue;
    private lock;
    private unlock;
    get hasWaiting(): boolean;
    runWith<T>(closure: () => Awaitable_2<T>): Promise<T>;
}

export declare function nonCircularClone<T>(value: T): T;

export declare class NoOpLog extends Log {
    log(): void;
    error(message: Error): void;
}

export declare function Option(metadata: OptionMetadata): (prototype: typeof Plugin.prototype, key: string | symbol) => void;

export declare type OptionMetadata = OptionMetadataType<OptionType.NONE, any> | OptionMetadataType<OptionType.BOOLEAN, boolean> | OptionMetadataType<OptionType.NUMBER, number> | OptionMetadataType<OptionType.STRING, string> | OptionMetadataType<OptionType.STRING_POSITIONAL, string> | OptionMetadataType<OptionType.BOOLEAN_STRING, boolean | string> | OptionMetadataType<OptionType.BOOLEAN_NUMBER, boolean | number> | OptionMetadataType<OptionType.ARRAY, string[]> | OptionMetadataType<OptionType.OBJECT, any>;

export declare interface OptionMetadataType<Type extends OptionType, Value> {
    type: Type;
    typeFormat?: Type extends OptionType.OBJECT ? string : undefined;
    name?: string;
    alias?: string;
    description?: string;
    negatable?: Type extends OptionType.BOOLEAN | OptionType.BOOLEAN_STRING | OptionType.BOOLEAN_NUMBER ? boolean : undefined;
    logName?: string;
    logValue?: (value: Value) => string | undefined;
    fromEntries?: Type extends OptionType.OBJECT ? (entries: [key: string, value: string][]) => Value : undefined;
    fromWrangler?: (config: WranglerConfig, configDir: string) => Value | undefined;
}

export declare type Options<Plugins extends PluginSignatures> = UnionToIntersection<PluginOptionsUnion<Plugins>>;

export declare enum OptionType {
    NONE = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    STRING = 3,
    STRING_POSITIONAL = 4,
    BOOLEAN_STRING = 5,
    BOOLEAN_NUMBER = 6,
    ARRAY = 7,
    OBJECT = 8
}

export declare class OutputGate {
    #private;
    /** Runs closure under the output gate, then waits for output gate to open */
    runWith<T>(closure: () => Awaitable<T>): Promise<T>;
    /** Waits for promises registered with this gate via waitUntil to resolve */
    waitForOpen(): Promise<void>;
    /**
     * Registers a promise with this output gate. The gate won't open until this
     * promise resolves.
     */
    waitUntil(promise: Promise<any>): void;
}

export declare abstract class Plugin<Options extends Context = never> {
    #private;
    protected readonly ctx: PluginContext;
    opts?: Map<string | symbol, OptionMetadata>;
    protected constructor(ctx: PluginContext);
    protected assignOptions(options?: Options): void;
    beforeSetup?(): Awaitable<BeforeSetupResult | void>;
    setup?(storageFactory: StorageFactory): Awaitable<SetupResult | void>;
    beforeReload?(): Awaitable<void>;
    reload?(bindings: Context, moduleExports: Context, mounts: Map<string, Mount>): Awaitable<void>;
    dispose?(): Awaitable<void>;
}

export declare interface PluginContext {
    log: Log;
    compat: Compatibility;
    rootPath: string;
    globalAsyncIO?: boolean;
}

export declare type PluginEntries<Plugins extends PluginSignatures> = [
name: keyof Plugins,
plugin: ValueOf<Plugins>
][];

export declare type PluginOptions<Plugins extends PluginSignatures> = {
    [key in keyof Plugins]: ExtractOptions<InstanceType<Plugins[key]>>;
};

export declare type PluginOptionsUnion<Plugins extends PluginSignatures> = ValueOf<PluginOptions<Plugins>>;

export declare type PluginSignature = {
    new (ctx: PluginContext, options?: Context): Plugin<Context>;
    prototype: {
        opts?: Map<string | symbol, OptionMetadata>;
    };
};

export declare type PluginSignatures = {
    [pluginName: string]: PluginSignature;
};

export declare function prefixError(prefix: string, e: any): Error;

export declare interface ProcessedModuleRule {
    type: ModuleRuleType;
    include: Matcher;
}

export declare function randomHex(digits?: number): string;

export declare class RequestContext {
    #private;
    readonly requestDepth: number;
    readonly pipelineDepth: number;
    readonly durableObject: boolean;
    constructor({ requestDepth, pipelineDepth, durableObject, }?: RequestContextOptions);
    runWith<T>(closure: () => T): T;
    get subrequests(): number;
    incrementSubrequests(count?: number): void;
}

export declare interface RequestContextOptions {
    /**
     * In this context, a request is the initial entry fetch to a Worker
     * (e.g. the incoming HTTP request), or fetch to a Durable Object stub.
     * The depth starts at 1, and increments for each recursive request.
     */
    requestDepth?: number;
    /**
     * The pipeline depth starts at 1, and increments for each recursive service
     * binding fetch. The requestDepth should not be incremented in this case.
     * The pipeline depth resets for each new request (as described above).
     */
    pipelineDepth?: number;
    /**
     * Whether this context is for inside a Durable Object fetch. Affects
     * WebSocket subrequest limits for incoming messages.
     */
    durableObject?: boolean;
}

export declare function resolveStoragePersist(rootPath: string, persist?: boolean | string): boolean | string | undefined;

/**
 * Runs closure with the context's input gate (if any) closed, unless
 * allowConcurrency is true. Should be called when performing storage
 * operations.
 */
export declare function runWithInputGateClosed<T>(closure: () => Promise<T>, allowConcurrency?: boolean): Promise<T>;

export declare function sanitisePath(unsafe: string): string;

export declare interface ScriptBlueprint {
    readonly filePath: string;
    readonly code: string;
}

export declare interface ScriptRunner {
    run(globalScope: Context, blueprint: ScriptBlueprint, modulesRules?: ProcessedModuleRule[], additionalModules?: AdditionalModules): Promise<ScriptRunnerResult>;
}

export declare interface ScriptRunnerResult {
    exports: Context;
    bundleSize?: number;
    watch?: string[];
}

export declare interface SetupResult extends BeforeSetupResult {
    globals?: Context;
    bindings?: Context;
    script?: ScriptBlueprint;
    requiresModuleExports?: boolean;
    additionalModules?: AdditionalModules;
}

export declare function spaceCase(s: string): string;

/**
 * Common class for key-value storage:
 * - Methods should always return fresh copies of data (safe to mutate returned)
 * - Methods shouldn't return expired keys
 */
export declare abstract class Storage {
    abstract has(key: string): Awaitable<boolean>;
    abstract get<Meta = unknown>(key: string, skipMetadata?: false): Awaitable<StoredValueMeta<Meta> | undefined>;
    abstract get(key: string, skipMetadata: true): Awaitable<StoredValue | undefined>;
    abstract put<Meta = unknown>(key: string, value: StoredValueMeta<Meta>): Awaitable<void>;
    abstract delete(key: string): Awaitable<boolean>;
    abstract list<Meta = unknown>(options?: StorageListOptions, skipMetadata?: false): Awaitable<StorageListResult<StoredKeyMeta<Meta>>>;
    abstract list(options: StorageListOptions, skipMetadata: true): Awaitable<StorageListResult<StoredKey>>;
    hasMany(keys: string[]): Promise<number>;
    getMany<Meta = unknown>(keys: string[], skipMetadata?: false): Promise<(StoredValueMeta<Meta> | undefined)[]>;
    getMany(keys: string[], skipMetadata: true): Promise<(StoredValue | undefined)[]>;
    putMany<Meta = unknown>(data: [key: string, value: StoredValueMeta<Meta>][]): Promise<void>;
    deleteMany(keys: string[]): Promise<number>;
}

export declare interface StorageFactory {
    storage(namespace: string, persist?: boolean | string): Awaitable<Storage>;
    dispose?(): Awaitable<void>;
}

export declare interface StorageListOptions {
    /** Returned keys must start with this string if defined */
    prefix?: string;
    /** Returned keys must be lexicographically >= this string if defined */
    start?: string;
    /** Returned keys must be lexicographically < this string if defined */
    end?: string;
    /** Return keys in reverse order, MUST be applied before the limit/cursor */
    reverse?: boolean;
    /** Cursor for pagination, undefined/empty-string means start at beginning */
    cursor?: string;
    /** Maximum number of keys to return if defined */
    limit?: number;
}

export declare interface StorageListResult<Key extends StoredKey = StoredKeyMeta> {
    keys: Key[];
    /** Cursor for next page */
    cursor: string;
}

export declare interface StoredKey {
    name: string;
}

export declare type StoredKeyMeta<Meta = unknown> = StoredKey & StoredMeta<Meta>;

export declare interface StoredMeta<Meta = unknown> {
    /** Unix timestamp in seconds when this key expires */
    expiration?: number;
    /** Arbitrary JSON-serializable object */
    metadata?: Meta;
}

export declare interface StoredValue {
    value: Uint8Array;
}

export declare type StoredValueMeta<Meta = unknown> = StoredValue & StoredMeta<Meta>;

export declare const STRING_SCRIPT_PATH = "<script>";

export declare class ThrowingEventTarget<EventMap extends Record<string, Event>> extends TypedEventTarget<EventMap> {
    #private;
    protected [kWrapListener]<Type extends keyof EventMap>(listener: (event: EventMap[Type]) => void): (event: EventMap[Type]) => void;
    dispatchEvent(event: ValueOf<EventMap>): boolean;
}

export declare function titleCase(s: string): string;

export declare type TypedEventListener<E extends Event> = ((e: E) => void) | {
    handleEvent(e: E): void;
};

export declare class TypedEventTarget<EventMap extends Record<string, Event>> extends EventTarget {
    #private;
    protected [kWrapListener]?<Type extends keyof EventMap>(listener: (event: EventMap[Type]) => void): (event: EventMap[Type]) => void;
    addEventListener<Type extends keyof EventMap>(type: Type, listener: TypedEventListener<EventMap[Type]> | null, options?: AddEventListenerOptions | boolean): void;
    removeEventListener<Type extends keyof EventMap>(type: Type, listener: TypedEventListener<EventMap[Type]> | null, options?: EventListenerOptions | boolean): void;
    dispatchEvent(event: ValueOf<EventMap>): boolean;
}

export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export declare type ValueOf<T> = T[keyof T];

export declare function viewToArray(view: ArrayBufferView): Uint8Array;

export declare function viewToBuffer(view: ArrayBufferView): ArrayBuffer;

/**
 * Waits for the context's input gate (if any) to be open before returning.
 * Should be called before returning result of async I/O (e.g. setTimeout, KV).
 */
export declare function waitForOpenInputGate(): Awaitable<void>;

/**
 * Waits for the context's output gate (if any) to be open before returning.
 * Should be called before making async I/O requests (e.g. fetch, KV put)
 * which may be using unconfirmed values.
 */
export declare function waitForOpenOutputGate(): Awaitable<void>;

/**
 * Registers promise with context's output gate (if any) unless allowUnconfirmed
 * is true. Should be called immediately (before any await) if returning a
 * promise for a storage write operation.
 */
export declare function waitUntilOnOutputGate<T>(promise: Promise<any>, allowUnconfirmed?: boolean): Promise<T>;

export declare interface WranglerConfig extends WranglerEnvironmentConfig {
    type?: "javascript" | "webpack" | "rust";
    compatibility_date?: string;
    compatibility_flags?: CompatibilityFlag[];
    build?: {
        command?: string;
        cwd?: string;
        watch_dir?: string;
        upload?: {
            format?: "service-worker" | "modules";
            dir?: string;
            main?: string;
            rules?: {
                type: ModuleRuleType;
                globs: string[];
                fallthrough?: boolean;
            }[];
        };
    };
    env?: Record<string, WranglerEnvironmentConfig>;
}

export declare interface WranglerEnvironmentConfig {
    name?: string;
    zone_id?: string;
    account_id?: string;
    workers_dev?: boolean;
    route?: string;
    routes?: string[];
    webpack_config?: string;
    vars?: Record<string, any>;
    kv_namespaces?: {
        binding: string;
        id?: string;
        preview_id?: string;
    }[];
    site?: {
        bucket: string;
        "entry-point"?: string;
        include?: string[];
        exclude?: string[];
    };
    durable_objects?: {
        bindings?: {
            name: string;
            class_name: string;
            script_name?: string;
        }[];
    };
    triggers?: {
        crons?: string[];
    };
    usage_model?: "bundled" | "unbound";
    wasm_modules?: Record<string, string>;
    text_blobs?: Record<string, string>;
    data_blobs?: Record<string, string>;
    experimental_services?: {
        name: string;
        service: string;
        environment: string;
    }[];
    miniflare?: {
        globals?: Record<string, any>;
        upstream?: string;
        watch?: boolean;
        build_watch_dirs?: string[];
        kv_persist?: boolean | string;
        cache?: boolean;
        cache_persist?: boolean | string;
        durable_objects_persist?: boolean | string;
        env_path?: string;
        host?: string;
        port?: number;
        open?: boolean | string;
        cf_fetch?: boolean | string;
        https?: boolean | string | {
            key?: string;
            cert?: string;
            ca?: string;
            pfx?: string;
            passphrase?: string;
        };
        live_reload?: boolean;
        update_check?: boolean;
        mounts?: Record<string, string>;
        route?: string;
        routes?: string[];
        global_async_io?: boolean;
        global_timers?: boolean;
        global_random?: boolean;
    };
}

export { }
