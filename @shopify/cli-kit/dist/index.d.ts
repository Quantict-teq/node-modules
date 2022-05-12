/// <reference types="node" />
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { ChildProcess } from 'node:child_process';
import { Readable as Readable$1, Writable } from 'node:stream';
import path$1 from 'path';
import * as fs from 'fs';
import { SpawnOptions } from 'child_process';
import { platform } from 'node:process';
import { RequestOptions } from 'http';

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
declare class Subscription implements SubscriptionLike {
    private initialTeardown?;
    /** @nocollapse */
    static EMPTY: Subscription;
    /**
     * A flag to indicate whether this Subscription has already been unsubscribed.
     */
    closed: boolean;
    private _parentage;
    /**
     * The list of registered finalizers to execute upon unsubscription. Adding and removing from this
     * list occurs in the {@link #add} and {@link #remove} methods.
     */
    private _finalizers;
    /**
     * @param initialTeardown A function executed first as part of the finalization
     * process that is kicked off when {@link #unsubscribe} is called.
     */
    constructor(initialTeardown?: (() => void) | undefined);
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    unsubscribe(): void;
    /**
     * Adds a finalizer to this subscription, so that finalization will be unsubscribed/called
     * when this subscription is unsubscribed. If this subscription is already {@link #closed},
     * because it has already been unsubscribed, then whatever finalizer is passed to it
     * will automatically be executed (unless the finalizer itself is also a closed subscription).
     *
     * Closed Subscriptions cannot be added as finalizers to any subscription. Adding a closed
     * subscription to a any subscription will result in no operation. (A noop).
     *
     * Adding a subscription to itself, or adding `null` or `undefined` will not perform any
     * operation at all. (A noop).
     *
     * `Subscription` instances that are added to this instance will automatically remove themselves
     * if they are unsubscribed. Functions and {@link Unsubscribable} objects that you wish to remove
     * will need to be removed manually with {@link #remove}
     *
     * @param teardown The finalization logic to add to this subscription.
     */
    add(teardown: TeardownLogic): void;
    /**
     * Checks to see if a this subscription already has a particular parent.
     * This will signal that this subscription has already been added to the parent in question.
     * @param parent the parent to check for
     */
    private _hasParent;
    /**
     * Adds a parent to this subscription so it can be removed from the parent if it
     * unsubscribes on it's own.
     *
     * NOTE: THIS ASSUMES THAT {@link _hasParent} HAS ALREADY BEEN CHECKED.
     * @param parent The parent subscription to add
     */
    private _addParent;
    /**
     * Called on a child when it is removed via {@link #remove}.
     * @param parent The parent to remove
     */
    private _removeParent;
    /**
     * Removes a finalizer from this subscription that was previously added with the {@link #add} method.
     *
     * Note that `Subscription` instances, when unsubscribed, will automatically remove themselves
     * from every other `Subscription` they have been added to. This means that using the `remove` method
     * is not a common thing and should be used thoughtfully.
     *
     * If you add the same finalizer instance of a function or an unsubscribable object to a `Subcription` instance
     * more than once, you will need to call `remove` the same number of times to remove all instances.
     *
     * All finalizer instances are removed to free up memory upon unsubscription.
     *
     * @param teardown The finalizer to remove from this subscription
     */
    remove(teardown: Exclude<TeardownLogic, void>): void;
}

/// <reference lib="esnext.asynciterable" />

/**
 * Note: This will add Symbol.observable globally for all TypeScript users,
 * however, we are no longer polyfilling Symbol.observable
 */
declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }
}
/** OPERATOR INTERFACES */
interface UnaryFunction<T, R> {
    (source: T): R;
}
interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {
}
/** SUBSCRIPTION INTERFACES */
interface Unsubscribable {
    unsubscribe(): void;
}
declare type TeardownLogic = Subscription | Unsubscribable | (() => void) | void;
interface SubscriptionLike extends Unsubscribable {
    unsubscribe(): void;
    readonly closed: boolean;
}
/** OBSERVABLE INTERFACES */
interface Subscribable<T> {
    subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}
interface Observer<T> {
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
}

/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
declare class Subscriber<T> extends Subscription implements Observer<T> {
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param next The `next` callback of an Observer.
     * @param error The `error` callback of an
     * Observer.
     * @param complete The `complete` callback of an
     * Observer.
     * @return A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     * @nocollapse
     * @deprecated Do not use. Will be removed in v8. There is no replacement for this
     * method, and there is no reason to be creating instances of `Subscriber` directly.
     * If you have a specific use case, please file an issue.
     */
    static create<T>(next?: (x?: T) => void, error?: (e?: any) => void, complete?: () => void): Subscriber<T>;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    protected isStopped: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    protected destination: Subscriber<any> | Observer<any>;
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     * There is no reason to directly create an instance of Subscriber. This type is exported for typings reasons.
     */
    constructor(destination?: Subscriber<any> | Observer<any>);
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value?: T): void;
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached `Error`. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err?: any): void;
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete(): void;
    unsubscribe(): void;
    protected _next(value: T): void;
    protected _error(err: any): void;
    protected _complete(): void;
}

/***
 * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
 */
interface Operator<T, R> {
    call(subscriber: Subscriber<R>, source: any): TeardownLogic;
}

/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
declare class Observable<T> implements Subscribable<T> {
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     */
    source: Observable<any> | undefined;
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     */
    operator: Operator<any, T> | undefined;
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic);
    /**
     * Creates a new Observable by calling the Observable constructor
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new observable
     * @nocollapse
     * @deprecated Use `new Observable()` instead. Will be removed in v8.
     */
    static create: (...args: any[]) => any;
    /**
     * Creates a new Observable, with this Observable instance as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param operator the operator defining the operation to take on the observable
     * @return a new observable with the Operator applied
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     * If you have implemented an operator using `lift`, it is recommended that you create an
     * operator by simply returning `new Observable()` directly. See "Creating new operators from
     * scratch" section here: https://rxjs.dev/guide/operators
     */
    lift<R>(operator?: Operator<T, R>): Observable<R>;
    subscribe(observer?: Partial<Observer<T>>): Subscription;
    subscribe(next: (value: T) => void): Subscription;
    /** @deprecated Instead of passing separate callback arguments, use an observer argument. Signatures taking separate callback arguments will be removed in v8. Details: https://rxjs.dev/deprecations/subscribe-arguments */
    subscribe(next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription;
    /**
     * Used as a NON-CANCELLABLE means of subscribing to an observable, for use with
     * APIs that expect promises, like `async/await`. You cannot unsubscribe from this.
     *
     * **WARNING**: Only use this with observables you *know* will complete. If the source
     * observable does not complete, you will end up with a promise that is hung up, and
     * potentially all of the state of an async function hanging out in memory. To avoid
     * this situation, look into adding something like {@link timeout}, {@link take},
     * {@link takeWhile}, or {@link takeUntil} amongst others.
     *
     * ## Example
     *
     * ```ts
     * import { interval, take } from 'rxjs';
     *
     * const source$ = interval(1000).pipe(take(4));
     *
     * async function getTotal() {
     *   let total = 0;
     *
     *   await source$.forEach(value => {
     *     total += value;
     *     console.log('observable -> ' + value);
     *   });
     *
     *   return total;
     * }
     *
     * getTotal().then(
     *   total => console.log('Total: ' + total)
     * );
     *
     * // Expected:
     * // 'observable -> 0'
     * // 'observable -> 1'
     * // 'observable -> 2'
     * // 'observable -> 3'
     * // 'Total: 6'
     * ```
     *
     * @param next a handler for each value emitted by the observable
     * @return a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    forEach(next: (value: T) => void): Promise<void>;
    /**
     * @param next a handler for each value emitted by the observable
     * @param promiseCtor a constructor function used to instantiate the Promise
     * @return a promise that either resolves on observable completion or
     *  rejects with the handled error
     * @deprecated Passing a Promise constructor will no longer be available
     * in upcoming versions of RxJS. This is because it adds weight to the library, for very
     * little benefit. If you need this functionality, it is recommended that you either
     * polyfill Promise, or you create an adapter to convert the returned native promise
     * to whatever promise implementation you wanted. Will be removed in v8.
     */
    forEach(next: (value: T) => void, promiseCtor: PromiseConstructorLike): Promise<void>;
    pipe(): Observable<T>;
    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
    pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
    pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
    pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): Observable<D>;
    pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): Observable<E>;
    pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): Observable<F>;
    pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): Observable<G>;
    pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): Observable<H>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): Observable<I>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>, ...operations: OperatorFunction<any, any>[]): Observable<unknown>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(): Promise<T | undefined>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(PromiseCtor: typeof Promise): Promise<T | undefined>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(PromiseCtor: PromiseConstructorLike): Promise<T | undefined>;
}

/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observers. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 */
declare class Subject<T> extends Observable<T> implements SubscriptionLike {
    closed: boolean;
    private currentObservers;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    observers: Observer<T>[];
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    isStopped: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    hasError: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    thrownError: any;
    /**
     * Creates a "subject" by basically gluing an observer to an observable.
     *
     * @nocollapse
     * @deprecated Recommended you do not use. Will be removed at some point in the future. Plans for replacement still under discussion.
     */
    static create: (...args: any[]) => any;
    constructor();
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    lift<R>(operator: Operator<T, R>): Observable<R>;
    next(value: T): void;
    error(err: any): void;
    complete(): void;
    unsubscribe(): void;
    get observed(): boolean;
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create customize Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return {Observable} Observable that the Subject casts to
     */
    asObservable(): Observable<T>;
}

interface BasePromptOptions$1 {
  name: string | (() => string)
  type: string | (() => string)
  message: string | (() => string) | (() => Promise<string>)
  initial?: any
  required?: boolean
  format?(value: string): string | Promise<string>
  result?(value: string): string | Promise<string>
  skip?: ((state: object) => boolean | Promise<boolean>) | boolean
  validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  onSubmit?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}

interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

interface ArrayPromptOptions$1 extends BasePromptOptions$1 {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
  choices: string[] | Choice[]
  maxChoices?: number
  muliple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
}

interface BooleanPromptOptions$1 extends BasePromptOptions$1 {
  type: 'confirm'
  initial?: boolean
}

interface StringPromptOptions$1 extends BasePromptOptions$1 {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  initial?: string
  multiline?: boolean
}

interface NumberPromptOptions$1 extends BasePromptOptions$1 {
  type: 'numeral'
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

interface SnippetPromptOptions$1 extends BasePromptOptions$1 {
  type: 'snippet'
  newline?: string
  template?: string
}

interface SortPromptOptions$1 extends BasePromptOptions$1 {
  type: 'sort'
  hint?: string
  drag?: boolean
  numbered?: boolean
}

type PromptOptions$1 =
  | BasePromptOptions$1
  | ArrayPromptOptions$1
  | BooleanPromptOptions$1
  | StringPromptOptions$1
  | NumberPromptOptions$1
  | SnippetPromptOptions$1
  | SortPromptOptions$1

declare class BasePrompt extends EventEmitter {
    constructor(options?: PromptOptions$1);

    render(): void;

    run(): Promise<any>;
  }

declare class Enquirer<T = object> extends EventEmitter {
  constructor(options?: object, answers?: T);

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(type: string, fn: typeof BasePrompt | (() => typeof BasePrompt)): this;

  /**
   * Register a custom prompt type.
   */
  register(type: { [key: string]: typeof BasePrompt | (() => typeof BasePrompt) }): this;

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param questions Options objects for one or more prompts to run.
   */
  prompt(
    questions:
      | PromptOptions$1
      | ((this: Enquirer) => PromptOptions$1)
      | (PromptOptions$1 | ((this: Enquirer) => PromptOptions$1))[]
  ): Promise<T>;

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: (this: this, enquirer: this) => void): this;
}

declare namespace Enquirer {
  function prompt<T = object>(
    questions:
      | PromptOptions$1
      | ((this: Enquirer) => PromptOptions$1)
      | (PromptOptions$1 | ((this: Enquirer) => PromptOptions$1))[]
  ): Promise<T>;

  class Prompt extends BasePrompt {}
}

/** Type of listr internal events. */
declare enum ListrEventType {
    TITLE = "TITLE",
    STATE = "STATE",
    ENABLED = "ENABLED",
    SUBTASK = "SUBTASK",
    DATA = "DATA",
    MESSAGE = "MESSAGE"
}

/** Listr Default Context */
declare type ListrContext = any | undefined;
/**
 * ListrTask.
 *
 * Defines the task, conditions and options to run a specific task in the listr.
 */
interface ListrTask<Ctx = ListrContext, Renderer extends ListrRendererFactory = any> {
    /**
     * Title of the task.
     *
     * Give this task a title if you want to track it by name in the current renderer.
     *
     * Tasks without a title will hide in the default renderer and are useful for running a background instance.
     * On verbose renderer, state changes from these tasks will log as 'Task without a title.'
     */
    title?: string;
    /**
     * The task itself.
     *
     * Task can be a sync or async function, an Observable, or a Stream.
     * Task will be executed, if the certain criteria of the state are met and whenever the time for that specific task has come.
     */
    task: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /**
     * Skip this task depending on the context.
     *
     * The function that has been passed in will be evaluated at the runtime when the task tries to initially run.
     */
    skip?: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean | string>);
    /**
     * Enable a task depending on the context.
     *
     * The function that has been passed in will be evaluated at the initial creation of the Listr class for rendering purposes,
     * as well as re-evaluated when the time for that specific task has come.
     */
    enabled?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>);
    /**
     * Adds the given number of retry attempts to the task if the task fails.
     */
    retry?: number;
    /**
     * Runs a specific event if the current task or any of the subtasks has failed.
     *
     * Mostly useful for rollback purposes for subtasks.
     * But can also be useful whenever a task is failed and some measures have to be taken to ensure the state is not changed.
     */
    rollback?: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /**
     * Set exit on the error option from task-level instead of setting it for all the subtasks.
     */
    exitOnError?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>);
    /**
     * Per task options, that depends on the selected renderer.
     *
     * These options depend on the implementation of the selected renderer. If the selected renderer has no options it will
     * be displayed as never.
     */
    options?: ListrGetRendererTaskOptions<Renderer>;
}
/**
 * Options to set the behavior of this base task.
 */
interface ListrOptions<Ctx = ListrContext> {
    /**
     * To inject a context through this options wrapper. Context can also be defined in run time.
     *
     * @default {}
     */
    ctx?: Ctx;
    /**
     * Concurrency sets how many tasks will be run at the same time in parallel.
     *
     * @default false > Default is to run everything synchronously.
     *
     * `true` will set it to `Infinity`, `false` will set it to synchronous.
     *
     * If you pass in a `number` it will limit it to that number.
     */
    concurrent?: boolean | number;
    /**
     * Determine the default behavior of exiting on errors.
     *
     * @default true > exit on any error coming from the tasks.
     */
    exitOnError?: boolean;
    /**
     * Determine the behavior of exiting after rollback actions.
     *
     * This is independent of exitOnError, since failure of a rollback can be a more critical operation comparing to
     * failing a single task.
     *
     * @default true > exit after rolling back tasks
     */
    exitAfterRollback?: boolean;
    /**
     * Collects errors to `ListrInstance.errors`
     *
     * This can take up a lot of memory, so disabling it can fix out-of-memory errors
     *
     * - 'full' will clone the current context and task in to the error instance
     * - 'minimal' will only collect the error message and the location
     * - false will collect no errors
     *
     * @default 'minimal'
     */
    collectErrors?: false | 'minimal' | 'full';
    /**
     * By default, Listr2 will track SIGINIT signal to update the renderer one last time before completely failing.
     *
     * @default true
     */
    registerSignalListeners?: boolean;
    /**
     * Determine the certain condition required to use the non-TTY renderer.
     *
     * @default null > handled internally
     */
    rendererFallback?: boolean | (() => boolean);
    /**
     * Determine the certain condition required to use the silent renderer.
     *
     * @default null > handled internally
     */
    rendererSilent?: boolean | (() => boolean);
    /**
     * Disabling the color, useful for tests and such.
     *
     * @default false
     */
    disableColor?: boolean;
    /**
     * Inject data directly to TaskWrapper.
     */
    injectWrapper?: {
        enquirer?: Enquirer<object>;
    };
}
/**
 * Task can be set of sync or async function, an Observable or a stream.
 */
declare type ListrTaskResult<Ctx> = string | Promise<any> | Listr<Ctx, ListrRendererValue, any> | Readable | NodeJS.ReadableStream | Observable<any>;
/**
 * Parent class options.
 *
 * Parent class has more options where you can also select the and set renderer and non-tty renderer.
 *
 * Any subtasks will respect those options so they will be stripped of that properties.
 */
declare type ListrBaseClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> = ListrOptions<Ctx> & ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>;
/**
 * Sub class options.
 *
 * Subtasks has reduced set options where the missing ones are explicitly set by the base class.
 */
declare type ListrSubClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue> = ListrOptions<Ctx> & Omit<ListrDefaultRendererOptions<Renderer>, 'renderer'>;
/** The internal communication event. */
declare type ListrEvent = {
    type: Exclude<ListrEventType, 'MESSAGE' | 'DATA'>;
    data?: string | boolean;
} | {
    type: ListrEventType.DATA;
    data: string;
} | {
    type: ListrEventType.MESSAGE;
    data: Task$1<any, any>['message'];
};
/**
 * Used to match event.type to ListrEvent permutations
 */
declare type ListrEventFromType<T extends ListrEventType, E = ListrEvent> = E extends {
    type: infer U;
} ? T extends U ? E : never : never;

interface BasePromptOptions {
    message: string | (() => string) | (() => Promise<string>);
    initial?: boolean | number | number[] | string | (() => string) | (() => Promise<string>);
    required?: boolean;
    stdin?: NodeJS.ReadStream;
    stdout?: NodeJS.WriteStream;
    header?: string;
    footer?: string;
    skip?: (value: any) => boolean | Promise<boolean>;
    format?: (value: any) => any | Promise<any>;
    result?: (value: any) => any | Promise<any>;
    validate?: (value: any, state: any) => boolean | Promise<boolean> | string | Promise<string> | Promise<string | boolean>;
    onSubmit?: (name: any, value: any, prompt: Enquirer.Prompt) => boolean | Promise<boolean>;
    onCancel?: (name: any, value: any, prompt: Enquirer.Prompt) => boolean | Promise<boolean>;
}
interface BasePromptOptionsWithName extends BasePromptOptions {
    name: string | (() => string);
}
interface ArrayPromptOptions extends BasePromptOptions {
    choices: string[] | BasePromptOptionsWithName[];
    maxChoices?: number;
    multiple?: boolean;
    initial?: number | number[];
    delay?: number;
    separator?: boolean;
    sort?: boolean;
    linebreak?: boolean;
    edgeLength?: number;
    align?: 'left' | 'right';
    scroll?: boolean;
    hint?: string;
}
interface BooleanPromptOptions extends BasePromptOptions {
    initial?: boolean | (() => string) | (() => Promise<string>);
}
interface StringPromptOptions extends BasePromptOptions {
    initial?: string;
    multiline?: boolean;
}
interface ScalePromptOptions extends ArrayPromptOptions {
    scale: StringPromptOptions[];
    margin?: [number, number, number, number];
}
interface NumberPromptOptions extends BasePromptOptions {
    min?: number;
    max?: number;
    delay?: number;
    float?: boolean;
    round?: boolean;
    major?: number;
    minor?: number;
    initial?: number;
}
interface SnippetPromptOptions extends BasePromptOptions {
    newline?: string;
    fields: Partial<BasePromptOptionsWithName>[];
    template: string;
}
interface SortPromptOptions extends BasePromptOptions {
    hint?: string;
    drag?: boolean;
    numbered?: boolean;
}
interface SurveyPromptOptions extends ArrayPromptOptions {
    scale: BasePromptOptionsWithName[];
    margin: [number, number, number, number];
}
interface QuizPromptOptions extends ArrayPromptOptions {
    correctChoice: number;
}
interface TogglePromptOptions extends BasePromptOptions {
    enabled?: string;
    disabled?: string;
}
/** Returns all the prompt options depending on the type selected. */
declare type PromptOptions<T extends boolean = false> = Unionize<{
    [K in PromptTypes]-?: T extends true ? {
        type: K;
    } & PromptOptionsType<K> & {
        name: string | (() => string);
    } : {
        type: K;
    } & PromptOptionsType<K>;
}> | ({
    type: string;
} & T extends true ? PromptOptionsType<string> & {
    name: string | (() => string);
} : PromptOptionsType<string>);
declare type Unionize<T extends Record<PropertyKey, unknown>> = {
    [P in keyof T]: T[P];
}[keyof T];
declare type PromptTypes = 'AutoComplete' | 'BasicAuth' | 'Confirm' | 'Editable' | 'Form' | 'Input' | 'Invisible' | 'List' | 'MultiSelect' | 'Numeral' | 'Password' | 'Quiz' | 'Scale' | 'Select' | 'Snippet' | 'Sort' | 'Survey' | 'Text' | 'Toggle';
declare type PromptOptionsType<T> = T extends keyof PromptOptionsMap ? PromptOptionsMap[T] : T extends string ? BasePromptOptions & Record<PropertyKey, unknown> : any;
declare class PromptOptionsMap implements Record<PromptTypes, Record<PropertyKey, any>> {
    AutoComplete: ArrayPromptOptions;
    BasicAuth: StringPromptOptions;
    Confirm: BooleanPromptOptions;
    Editable: ArrayPromptOptions;
    Form: ArrayPromptOptions;
    Input: StringPromptOptions;
    Invisible: StringPromptOptions;
    List: ArrayPromptOptions;
    MultiSelect: ArrayPromptOptions;
    Numeral: NumberPromptOptions;
    Password: StringPromptOptions;
    Quiz: QuizPromptOptions;
    Scale: ScalePromptOptions;
    Select: ArrayPromptOptions;
    Snippet: SnippetPromptOptions;
    Sort: SortPromptOptions;
    Survey: SurveyPromptOptions;
    Text: StringPromptOptions;
    Toggle: TogglePromptOptions;
}
interface PromptInstance extends Omit<BasePromptOptions, 'onCancel' | 'onSubmit'> {
    submit: () => void;
    cancel: (err?: string) => void;
}

/**
 * Extend the task to have more functionality while accesing from the outside.
 */
declare class TaskWrapper<Ctx, Renderer extends ListrRendererFactory> {
    task: Task$1<Ctx, ListrRendererFactory>;
    errors: ListrError<Ctx>[];
    private options;
    constructor(task: Task$1<Ctx, ListrRendererFactory>, errors: ListrError<Ctx>[], options: ListrBaseClassOptions<Ctx, any, any>);
    /** Get the title of the current task. */
    get title(): string;
    /** Change the title of the current task. */
    set title(data: string);
    /** Get the output from the output channel. */
    get output(): string;
    /** Send a output to the output channel. */
    set output(data: string);
    /** Create a new subtask with given renderer selection from the parent task. */
    newListr<NewCtx = Ctx>(task: ListrTask<NewCtx, Renderer> | ListrTask<NewCtx, Renderer>[] | ((parent: Omit<this, 'skip' | 'enabled'>) => ListrTask<NewCtx, Renderer> | ListrTask<NewCtx, Renderer>[]), options?: ListrSubClassOptions<NewCtx, Renderer>): Listr<NewCtx, any, any>;
    /** Report a error in process for error collection. */
    report(error: Error, type: ListrErrorTypes): void;
    /** Skip current task. */
    skip(message?: string): void;
    /** Get the number of retrying, else returns false */
    isRetrying(): Task$1<Ctx, Renderer>['retry'];
    /**
     * Create a new Enquirer prompt using prompt options.
     *
     * Since process.stdout is controlled by Listr, this will passthrough all Enquirer data through internal stdout.
     */
    prompt<T = any>(options: PromptOptions | PromptOptions<true>[]): Promise<T>;
    /** Cancels the current prompt attach to this task. */
    cancelPrompt(throwError?: boolean): void;
    /**
     * Pass stream of data to internal stdout.
     *
     * Since Listr2 takes control of process.stdout utilizing the default renderer, any data outputted to process.stdout
     * will corupt its looks.
     *
     * This returns a fake stream to pass any stream inside Listr as task data.
     */
    stdout(): NodeJS.WriteStream & NodeJS.WritableStream;
    /** Run this task. */
    run(ctx: Ctx): Promise<void>;
}

/** Available task states. */
declare enum ListrTaskState {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    ROLLING_BACK = "ROLLING_BACK",
    ROLLED_BACK = "ROLLED_BACK",
    RETRY = "RETRY"
}

/**
 * Create a task from the given set of variables and make it runnable.
 */
declare class Task$1<Ctx, Renderer extends ListrRendererFactory> extends Subject<ListrEvent> {
    listr: Listr<Ctx, any, any>;
    tasks: ListrTask<Ctx, any>;
    options: ListrOptions;
    rendererOptions: ListrGetRendererOptions<Renderer>;
    /** Unique id per task, randomly generated in the uuid v4 format */
    id: string;
    /** The current state of the task. */
    state: string;
    /** The task object itself, to further utilize it. */
    task: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /** Extend current task with multiple subtasks. */
    subtasks: Task$1<Ctx, any>[];
    /** Title of the task */
    title?: string;
    /** Untouched unchanged title of the task */
    initialTitle?: string;
    /** Output data from the task. */
    output?: string;
    /** Skip current task. */
    skip: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean | string>);
    /** Current retry number of the task if retrying */
    retry?: {
        count: number;
        withError?: any;
    };
    /**
     * A channel for messages.
     *
     * This requires a separate channel for messages like error, skip or runtime messages to further utilize in the renderers.
     */
    message: {
        /** Run time of the task, if it has been successfully resolved. */
        duration?: number;
        /** Error message of the task, if it has been failed. */
        error?: string;
        /** Skip message of the task, if it has been skipped. */
        skip?: string;
        /** Rollback message of the task, if the rollback finishes */
        rollback?: string;
        /** Retry messages */
        retry?: {
            count: number;
            withError?: any;
        };
    };
    /** Per task options for the current renderer of the task. */
    rendererTaskOptions: ListrGetRendererTaskOptions<Renderer>;
    /** This will be triggered each time a new render should happen. */
    renderHook$: Subject<void>;
    prompt: undefined | PromptInstance | PromptError;
    private enabled;
    private enabledFn;
    constructor(listr: Listr<Ctx, any, any>, tasks: ListrTask<Ctx, any>, options: ListrOptions, rendererOptions: ListrGetRendererOptions<Renderer>);
    set state$(state: ListrTaskState);
    set output$(data: string);
    set message$(data: Task$1<Ctx, Renderer>['message']);
    set title$(title: string);
    /**
     * A function to check whether this task should run at all via enable.
     */
    check(ctx: Ctx): Promise<void>;
    /** Returns whether this task has subtasks. */
    hasSubtasks(): boolean;
    /** Returns whether this task is in progress. */
    isPending(): boolean;
    /** Returns whether this task is skipped. */
    isSkipped(): boolean;
    /** Returns whether this task has been completed. */
    isCompleted(): boolean;
    /** Returns whether this task has been failed. */
    hasFailed(): boolean;
    /** Returns whether this task has an active rollback task going on. */
    isRollingBack(): boolean;
    /** Returns whether the rollback action was successful. */
    hasRolledBack(): boolean;
    /** Returns whether this task has an actively retrying task going on. */
    isRetrying(): boolean;
    /** Returns whether enabled function resolves to true. */
    isEnabled(): boolean;
    /** Returns whether this task actually has a title. */
    hasTitle(): boolean;
    /** Returns whether this task has a prompt inside. */
    isPrompt(): boolean;
    /** Run the current task. */
    run(context: Ctx, wrapper: TaskWrapper<Ctx, Renderer>): Promise<void>;
}

/** Default updating renderer for Listr2 */
declare class DefaultRenderer implements ListrRenderer {
    tasks: Task$1<any, typeof DefaultRenderer>[];
    options: typeof DefaultRenderer['rendererOptions'];
    renderHook$?: Task$1<any, any>['renderHook$'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the defauult renderer */
    static rendererOptions: {
        /**
         * indentation per level of subtask
         *
         * @default 2
         */
        indentation?: number;
        /**
         * clear all the output generated by the renderer when the task finishes its execution
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        clearOutput?: boolean;
        /**
         * show the subtasks of the current task
         *
         * @default true
         */
        showSubtasks?: boolean;
        /**
         * collapse subtasks after current task completes its execution
         *
         * @default true
         */
        collapse?: boolean;
        /**
         * show skip messages or show the original title of the task, this will also disable collapseSkips mode
         *
         * You can disable showing the skip messages, even though you passed in a message by settings this option,
         * if you want to keep the original task title intact.
         *
         * @default true
         */
        showSkipMessage?: boolean;
        /**
         * collapse skip messages into a single message and overwrite the task title
         *
         * @default true
         */
        collapseSkips?: boolean;
        /**
         * suffix skip messages with [SKIPPED] when in collapseSkips mode
         *
         * @default true
         */
        suffixSkips?: boolean;
        /**
         * shows the thrown error message or show the original title of the task, this will also disable collapseErrors mode
         * You can disable showing the error messages, even though you passed in a message by settings this option,
         * if you want to keep the original task title intact.
         *
         * @default true
         */
        showErrorMessage?: boolean;
        /**
         * collapse error messages into a single message and overwrite the task title
         *
         * @default true
         */
        collapseErrors?: boolean;
        /**
         * suffix retry messages with [RETRY-${COUNT}] when retry is enabled for a task
         *
         * @default true
         */
        suffixRetries?: boolean;
        /**
         * only update through triggers from renderhook
         *
         * useful for tests and stuff. this will disable showing spinner and only update the screen if something else has
         * happened in the task worthy to show
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        lazy?: boolean;
        /**
         * show duration for all tasks
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        showTimer?: boolean;
        /**
         * removes empty lines from the data output
         *
         * @default true
         */
        removeEmptyLines?: boolean;
        /**
         * formats data output depending on your requirements.
         *
         * @default 'truncate'
         * @global global option that can not be temperated with subtasks
         */
        formatOutput?: 'truncate' | 'wrap';
    };
    /** per task options for the default renderer */
    static rendererTaskOptions: {
        /**
         * write task output to the bottom bar instead of the gap under the task title itself.
         * useful for a stream of data.
         * @default false
         *
         * `true` only keep 1 line of the latest data outputted by the task.
         * `false` only keep 1 line of the latest data outputted by the task.
         * `number` will keep designated data of the latest data outputted by the task.
         */
        bottomBar?: boolean | number;
        /**
         * keep output after task finishes
         * @default false
         *
         * works both for the bottom bar and the default behavior
         */
        persistentOutput?: boolean;
        /**
         * show the task time if it was successful
         */
        showTimer?: boolean;
    };
    private id?;
    private bottomBar;
    private promptBar;
    private readonly spinner;
    private spinnerPosition;
    constructor(tasks: Task$1<any, typeof DefaultRenderer>[], options: typeof DefaultRenderer['rendererOptions'], renderHook$?: Task$1<any, any>['renderHook$']);
    getTaskOptions(task: Task$1<any, typeof DefaultRenderer>): typeof DefaultRenderer['rendererTaskOptions'];
    isBottomBar(task: Task$1<any, typeof DefaultRenderer>): boolean;
    hasPersistentOutput(task: Task$1<any, typeof DefaultRenderer>): boolean;
    hasTimer(task: Task$1<any, typeof DefaultRenderer>): boolean;
    getSelfOrParentOption<T extends keyof typeof DefaultRenderer['rendererOptions']>(task: Task$1<any, typeof DefaultRenderer>, key: T): typeof DefaultRenderer['rendererOptions'][T];
    getTaskTime(task: Task$1<any, typeof DefaultRenderer>): string;
    createRender(options?: {
        tasks?: boolean;
        bottomBar?: boolean;
        prompt?: boolean;
    }): string;
    render(): void;
    end(): void;
    private multiLineRenderer;
    private renderBottomBar;
    private renderPrompt;
    private dumpData;
    private formatString;
    private indentMultilineOutput;
    private getSymbol;
    private addSuffixToMessage;
}

declare class SilentRenderer implements ListrRenderer {
    tasks: Task$1<any, typeof SilentRenderer>[];
    options: typeof SilentRenderer['rendererOptions'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the silent renderer */
    static rendererOptions: never;
    /** per task options for the silent renderer */
    static rendererTaskOptions: never;
    constructor(tasks: Task$1<any, typeof SilentRenderer>[], options: typeof SilentRenderer['rendererOptions']);
    render(): void;
    end(): void;
}

/**
 * This is the default renderer which is neither verbose or updating.
 * It provides short output like update renderer, but does not disturb
 * stdin during execution of listr tasks
 */
declare class SimpleRenderer implements ListrRenderer {
    readonly tasks: Task$1<any, typeof SimpleRenderer>[];
    options: typeof SimpleRenderer['rendererOptions'];
    static nonTTY: boolean;
    static rendererOptions: {
        /**
         * if true this will add
         * timestamp at the begin of the rendered line
         *
         * @example
         *
         * ```bash
         * [12:33:44] ✔ Do something important
         * ```
         *
         * @default false
         */
        prefixWithTimestamp?: boolean;
        /**
         * choose between process.stdout and process.stderr
         *
         * @default stdout
         */
        output?: 'stdout' | 'stderr';
    };
    static rendererTaskOptions: never;
    /**
     * Event type renderer map contains functions to process different task events
     */
    eventTypeRendererMap: Partial<{
        [P in ListrEventType]: (t: Task$1<any, typeof SimpleRenderer>, event: ListrEventFromType<P>) => void;
    }>;
    constructor(tasks: Task$1<any, typeof SimpleRenderer>[], options: typeof SimpleRenderer['rendererOptions']);
    static now(): Date;
    static formatTitle(task?: Task$1<any, typeof SimpleRenderer>): string;
    log(output?: string): void;
    end(): void;
    render(tasks?: Task$1<any, typeof SimpleRenderer>[]): void;
}

/** Default loglevels for the logger */
declare enum LogLevels {
    SILENT = "SILENT",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    SUCCESS = "SUCCESS",
    DATA = "DATA",
    STARTED = "STARTED",
    TITLE = "TITLE",
    RETRY = "RETRY",
    ROLLBACK = "ROLLBACK"
}

/**
 * Options for the logger
 */
interface LoggerOptions {
    useIcons: boolean;
}

/**
 * A internal logger for using in the verbose renderer mostly.
 */
declare class Logger {
    private options?;
    constructor(options?: LoggerOptions);
    fail(message: string): void;
    skip(message: string): void;
    success(message: string): void;
    data(message: string): void;
    start(message: string): void;
    title(message: string): void;
    retry(message: string): void;
    rollback(message: string): void;
    protected parseMessage(level: LogLevels, message: string): string;
    protected logColoring({ level, message }: {
        level: LogLevels;
        message: string;
    }): string;
    private wrapInBrackets;
}

declare class VerboseRenderer implements ListrRenderer {
    tasks: Task$1<any, typeof VerboseRenderer>[];
    options: typeof VerboseRenderer['rendererOptions'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the verbose renderer */
    static rendererOptions: ({
        /**
             * useIcons instead of text for log level
             * @default false
             */
        useIcons?: boolean;
        /**
             * log tasks with empty titles
             * @default true
             */
        logEmptyTitle?: boolean;
        /**
             * log title changes
             * @default true
             */
        logTitleChange?: boolean;
        /**
             * show duration for all tasks
             */
        showTimer?: boolean;
    } & {
        /**
             * inject a custom logger
             */
        logger?: new (...args: any) => Logger;
        /**
             * inject options to custom logger
             */
        options?: any;
    });
    /** per task options for the verbose renderer */
    static rendererTaskOptions: never;
    private logger;
    constructor(tasks: Task$1<any, typeof VerboseRenderer>[], options: typeof VerboseRenderer['rendererOptions']);
    render(): void;
    end(): void;
    private verboseRenderer;
}

/** The default renderer value used in Listr2 applications */
declare type ListrDefaultRendererValue = 'default';
/** Type of default renderer */
declare type ListrDefaultRenderer = typeof DefaultRenderer;
/** Name of default fallback renderer */
declare type ListrFallbackRendererValue = 'verbose';
/** Type of default fallback renderer */
declare type ListrFallbackRenderer = typeof VerboseRenderer;
/** Silent rendere for internal usage */
declare type ListrSilentRendererValue = 'silent';
/** Typeof silent renderer */
declare type ListrSilentRenderer = typeof SilentRenderer;
/** Simple renderer that simplifies things */
declare type ListrSimpleRendererValue = 'simple';
/** Typeof simple renderer */
declare type ListrSimpleRenderer = typeof SimpleRenderer;
/**
 * Listr2 can process either the integrated renderers as string aliases,
 * or utilize a compatible style renderer that extends the ListrRenderer abstract class.
 */
declare type ListrRendererValue = ListrSilentRendererValue | ListrDefaultRendererValue | ListrSimpleRendererValue | ListrFallbackRendererValue | ListrRendererFactory;
/**
 * Returns the class type from friendly names of the renderers.
 */
declare type ListrGetRendererClassFromValue<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer : T extends ListrSimpleRendererValue ? ListrSimpleRenderer : T extends ListrFallbackRendererValue ? ListrFallbackRenderer : T extends ListrSilentRenderer ? ListrSilentRenderer : T extends ListrRendererFactory ? T : never;
/**
 * Returns renderer global options depending on the renderer type.
 */
declare type ListrGetRendererOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer['rendererOptions'] : T extends ListrSimpleRendererValue ? ListrSimpleRenderer['rendererOptions'] : T extends ListrFallbackRendererValue ? ListrFallbackRenderer['rendererOptions'] : T extends ListrSilentRenderer ? ListrSilentRenderer['rendererOptions'] : T extends ListrRendererFactory ? T['rendererOptions'] : never;
/**
 * Returns renderer per task options depending on the renderer type.
 */
declare type ListrGetRendererTaskOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer['rendererTaskOptions'] : T extends ListrSimpleRendererValue ? ListrSimpleRenderer : T extends ListrFallbackRendererValue ? ListrFallbackRenderer['rendererTaskOptions'] : T extends ListrSilentRenderer ? ListrSilentRenderer['rendererTaskOptions'] : T extends ListrRendererFactory ? T['rendererTaskOptions'] : never;
/** Select renderer as default renderer */
interface ListrDefaultRendererOptions<T extends ListrRendererValue> {
    /** the default renderer */
    renderer?: T;
    /** Renderer options depending on the current renderer */
    rendererOptions?: ListrGetRendererOptions<T>;
}
/** Select a fallback renderer to fallback to in non-tty conditions */
interface ListrDefaultNonTTYRendererOptions<T extends ListrRendererValue> {
    /** the fallback renderer to fallback to on non-tty conditions */
    nonTTYRenderer?: T;
    /** Renderer options depending on the current renderer */
    nonTTYRendererOptions?: ListrGetRendererOptions<T>;
}
/** The bones of a listr renderer. */
declare class ListrRenderer {
    /** designate renderer global options that is specific to the current renderer */
    static rendererOptions: Record<PropertyKey, any>;
    /** designate renderer per task options that is specific to the current renderer  */
    static rendererTaskOptions: Record<PropertyKey, any>;
    /** designate whether this renderer can work in non-tty environments */
    static nonTTY: boolean;
    /** A function to what to do on render */
    render: () => void;
    /** A function to what to do on end of the render */
    end: (err?: Error) => void;
    /** create a new renderer */
    constructor(tasks: readonly Task$1<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions, renderHook$?: Subject<void>);
}
/** A renderer factory from the current type */
declare type ListrRendererFactory = typeof ListrRenderer;

/** The internal error handling mechanism.. */
declare class ListrError<Ctx extends Record<PropertyKey, any> = Record<PropertyKey, any>> extends Error {
    error: Error;
    type: ListrErrorTypes;
    task: Task$1<Ctx, ListrRendererFactory>;
    path: string;
    ctx: Ctx;
    constructor(error: Error, type: ListrErrorTypes, task: Task$1<Ctx, ListrRendererFactory>);
}
/**
 * The actual error type that is collected and to help identify where the error is triggered from.
 */
declare enum ListrErrorTypes {
    /** Task has failed and will try to retry. */
    WILL_RETRY = "WILL_RETRY",
    /** Task has failed and will try to rollback. */
    WILL_ROLLBACK = "WILL_ROLLBACK",
    /** Task has failed, ran the rollback action but the rollback action itself has failed. */
    HAS_FAILED_TO_ROLLBACK = "HAS_FAILED_TO_ROLLBACK",
    /** Task has failed. */
    HAS_FAILED = "HAS_FAILED",
    /** Task has failed, but exitOnError is set to false, so will ignore this error. */
    HAS_FAILED_WITHOUT_ERROR = "HAS_FAILED_WITHOUT_ERROR"
}
/** The internal error handling mechanism for prompts only. */
declare class PromptError extends Error {
    constructor(message: string);
}

/**
 * Creates a new set of Listr2 task list.
 */
declare class Listr<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> {
    task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>;
    parentTask?: Task$1<any, any>;
    tasks: Task$1<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    err: ListrError<Ctx>[];
    ctx: Ctx;
    rendererClass: ListrRendererFactory;
    rendererClassOptions: ListrGetRendererOptions<ListrRendererFactory>;
    renderHook$: Task$1<any, any>['renderHook$'];
    path: string[];
    private concurrency;
    private renderer;
    constructor(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>, parentTask?: Task$1<any, any>);
    add(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[]): void;
    run(context?: Ctx): Promise<Ctx>;
    private checkAll;
    private runTask;
}

interface Question {
    type: 'input' | 'select';
    name: string;
    message: string;
    validate?: (value: string) => string | boolean;
    default?: string;
    choices?: string[] | {
        name: string;
        value: string;
    }[];
}
declare const prompt: <T>(questions: Question[]) => Promise<T>;

type ui_Question = Question;
declare const ui_prompt: typeof prompt;
type ui_Listr<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> = Listr<Ctx, Renderer, FallbackRenderer>;
declare const ui_Listr: typeof Listr;
declare namespace ui {
  export {
    ui_Question as Question,
    ui_prompt as prompt,
    ui_Listr as Listr,
  };
}

/**
 * A fatal error represents an error shouldn't be rescued and that causes the execution to terminate.
 * There shouldn't be code that catches fatal errors.
 */
declare class Fatal extends Error {
    tryMessage: string | null;
    constructor(message: string, tryMessage?: string | null);
}
/**
 * An abort error is a fatal error that shouldn't be reported as a bug.
 * Those usually represent unexpected scenarios that we can't handle and that usually require some action from the developer
 */
declare class Abort extends Fatal {
}
declare class AbortSilent extends Fatal {
    constructor();
}
/**
 * A bug error is an error that represents a bug and therefore should be reported.
 */
declare class Bug extends Fatal {
}
/**
 * A function that handles errors that blow up in the CLI.
 * @param error Error to be handled.
 * @returns A promise that resolves with the error passed.
 */
declare function handler(error: Error): Promise<Error>;
declare function mapper(error: Error): Promise<Error>;

type error$1_Fatal = Fatal;
declare const error$1_Fatal: typeof Fatal;
type error$1_Abort = Abort;
declare const error$1_Abort: typeof Abort;
type error$1_AbortSilent = AbortSilent;
declare const error$1_AbortSilent: typeof AbortSilent;
type error$1_Bug = Bug;
declare const error$1_Bug: typeof Bug;
declare const error$1_handler: typeof handler;
declare const error$1_mapper: typeof mapper;
declare namespace error$1 {
  export {
    error$1_Fatal as Fatal,
    error$1_Abort as Abort,
    error$1_AbortSilent as AbortSilent,
    error$1_Bug as Bug,
    error$1_handler as handler,
    error$1_mapper as mapper,
  };
}

interface ExecaReturnBase<StdoutStderrType> {
	/**
	The file and arguments that were run, for logging purposes.

	This is not escaped and should not be executed directly as a process, including using `execa()` or `execaCommand()`.
	*/
	command: string;

	/**
	Same as `command` but escaped.

	This is meant to be copy and pasted into a shell, for debugging purposes.
	Since the escaping is fairly basic, this should not be executed directly as a process, including using `execa()` or `execaCommand()`.
	*/
	escapedCommand: string;

	/**
	The numeric exit code of the process that was run.
	*/
	exitCode: number;

	/**
	The output of the process on stdout.
	*/
	stdout: StdoutStderrType;

	/**
	The output of the process on stderr.
	*/
	stderr: StdoutStderrType;

	/**
	Whether the process failed to run.
	*/
	failed: boolean;

	/**
	Whether the process timed out.
	*/
	timedOut: boolean;

	/**
	Whether the process was killed.
	*/
	killed: boolean;

	/**
	The name of the signal that was used to terminate the process. For example, `SIGFPE`.

	If a signal terminated the process, this property is defined and included in the error message. Otherwise it is `undefined`.
	*/
	signal?: string;

	/**
	A human-friendly description of the signal that was used to terminate the process. For example, `Floating point arithmetic error`.

	If a signal terminated the process, this property is defined and included in the error message. Otherwise it is `undefined`. It is also `undefined` when the signal is very uncommon which should seldomly happen.
	*/
	signalDescription?: string;
}

interface ExecaSyncReturnValue<StdoutErrorType = string>
	extends ExecaReturnBase<StdoutErrorType> {
}

/**
Result of a child process execution. On success this is a plain object. On failure this is also an `Error` instance.

The child process fails when:
- its exit code is not `0`
- it was killed with a signal
- timing out
- being canceled
- there's not enough memory or there are already too many child processes
*/
interface ExecaReturnValue<StdoutErrorType = string>
	extends ExecaSyncReturnValue<StdoutErrorType> {
	/**
	The output of the process with `stdout` and `stderr` interleaved.

	This is `undefined` if either:
	- the `all` option is `false` (default value)
	- `execaSync()` was used
	*/
	all?: StdoutErrorType;

	/**
	Whether the process was canceled.

	You can cancel the spawned process using the [`signal`](https://github.com/sindresorhus/execa#signal-1) option.
	*/
	isCanceled: boolean;
}

interface ExecaSyncError<StdoutErrorType = string>
	extends Error,
	ExecaReturnBase<StdoutErrorType> {
	/**
	Error message when the child process failed to run. In addition to the underlying error message, it also contains some information related to why the child process errored.

	The child process stderr then stdout are appended to the end, separated with newlines and not interleaved.
	*/
	message: string;

	/**
	This is the same as the `message` property except it does not include the child process stdout/stderr.
	*/
	shortMessage: string;

	/**
	Original error message. This is the same as the `message` property except it includes neither the child process stdout/stderr nor some additional information added by Execa.

	This is `undefined` unless the child process exited due to an `error` event or a timeout.
	*/
	originalMessage?: string;
}

interface ExecaError<StdoutErrorType = string>
	extends ExecaSyncError<StdoutErrorType> {
	/**
	The output of the process with `stdout` and `stderr` interleaved.

	This is `undefined` if either:
	- the `all` option is `false` (default value)
	- `execaSync()` was used
	*/
	all?: StdoutErrorType;

	/**
	Whether the process was canceled.
	*/
	isCanceled: boolean;
}

interface KillOptions {
	/**
	Milliseconds to wait for the child process to terminate before sending `SIGKILL`.

	Can be disabled with `false`.

	@default 5000
	*/
	forceKillAfterTimeout?: number | false;
}

interface ExecaChildPromise<StdoutErrorType> {
	/**
	Stream combining/interleaving [`stdout`](https://nodejs.org/api/child_process.html#child_process_subprocess_stdout) and [`stderr`](https://nodejs.org/api/child_process.html#child_process_subprocess_stderr).

	This is `undefined` if either:
		- the `all` option is `false` (the default value)
		- both `stdout` and `stderr` options are set to [`'inherit'`, `'ipc'`, `Stream` or `integer`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio)
	*/
	all?: Readable$1;

	catch<ResultType = never>(
		onRejected?: (reason: ExecaError<StdoutErrorType>) => ResultType | PromiseLike<ResultType>
	): Promise<ExecaReturnValue<StdoutErrorType> | ResultType>;

	/**
	Same as the original [`child_process#kill()`](https://nodejs.org/api/child_process.html#child_process_subprocess_kill_signal), except if `signal` is `SIGTERM` (the default value) and the child process is not terminated after 5 seconds, force it by sending `SIGKILL`.
	*/
	kill(signal?: string, options?: KillOptions): void;

	/**
	Similar to [`childProcess.kill()`](https://nodejs.org/api/child_process.html#child_process_subprocess_kill_signal). This is preferred when cancelling the child process execution as the error is more descriptive and [`childProcessResult.isCanceled`](#iscanceled) is set to `true`.
	*/
	cancel(): void;
}

type ExecaChildProcess<StdoutErrorType = string> = ChildProcess &
ExecaChildPromise<StdoutErrorType> &
Promise<ExecaReturnValue<StdoutErrorType>>;

interface ExecOptions {
    cwd?: string;
    env?: any;
    stdout?: Writable;
    stderr?: Writable;
}
declare const open: (url: string) => Promise<void>;
/**
 * Runs a command asynchronously, aggregates the stdout data, and returns it.
 * @param command {string} Command to be executed.
 * @param args {string[]} Arguments to pass to the command.
 * @returns A promise that resolves with the aggregatted stdout of the command.
 */
declare const captureOutput: (command: string, args: string[]) => Promise<string>;
declare const exec: (command: string, args: string[], options?: ExecOptions | undefined) => ExecaChildProcess<string>;

type system_ExecOptions = ExecOptions;
declare const system_open: typeof open;
declare const system_captureOutput: typeof captureOutput;
declare const system_exec: typeof exec;
declare namespace system {
  export {
    system_ExecOptions as ExecOptions,
    system_open as open,
    system_captureOutput as captureOutput,
    system_exec as exec,
  };
}

declare function create$1(templateContent: string): (data: object) => Promise<string>;
/**
 * Given a directory, it traverses the files and directories recursively
 * and replaces variables in directory and file names, and files' content
 * using the Liquid template engine.
 * Files indicate that they are liquid template by using the .liquid extension.
 * @param from {string} Directory that contains the template.
 * @param to {string} Output directory.
 * @param data {string} Data to feed the template engine.
 */
declare function recursiveDirectoryCopy(from: string, to: string, data: any): Promise<void>;

declare const template_recursiveDirectoryCopy: typeof recursiveDirectoryCopy;
declare namespace template {
  export {
    create$1 as create,
    template_recursiveDirectoryCopy as recursiveDirectoryCopy,
  };
}

interface Options$5 {
    splitRegexp?: RegExp | RegExp[];
    stripRegexp?: RegExp | RegExp[];
    delimiter?: string;
    transform?: (part: string, index: number, parts: string[]) => string;
}

declare function camelCase(input: string, options?: Options$5): string;

declare function paramCase(input: string, options?: Options$5): string;

declare function snakeCase(input: string, options?: Options$5): string;

/** Returns a random string */
declare function randomHex(size: number): string;
declare function generateRandomChallengePair(): {
    codeVerifier: string;
    codeChallenge: string;
};
/**
 * Given a string, it returns it with the first letter capitalized.
 * @param string {string} String whose first letter will be caplitalized.
 * @returns The given string with its first letter capitalized.
 */
declare function capitalize(string: string): string;

declare const string_randomHex: typeof randomHex;
declare const string_generateRandomChallengePair: typeof generateRandomChallengePair;
declare const string_capitalize: typeof capitalize;
declare namespace string {
  export {
    string_randomHex as randomHex,
    string_generateRandomChallengePair as generateRandomChallengePair,
    string_capitalize as capitalize,
    camelCase as camelize,
    paramCase as hyphenize,
    snakeCase as underscore,
  };
}

declare const sep = "/";
declare const delimiter = ":";
declare const normalize: typeof path$1.normalize;
declare const join: typeof path$1.join;
declare const resolve: typeof path$1.resolve;
declare function normalizeString(path: string, allowAboveRoot: boolean): string;
declare const isAbsolute: typeof path$1.isAbsolute;
declare const toNamespacedPath: typeof path$1.toNamespacedPath;
declare const extname: typeof path$1.extname;
declare const relative: typeof path$1.relative;
declare const dirname: typeof path$1.dirname;
declare const format: typeof path$1.format;
declare const basename: typeof path$1.basename;
declare const parse: typeof path$1.parse;

interface Options$4 {
	/**
	The current working directory.

	@default process.cwd()
	*/
	readonly cwd?: URL | string;

	/**
	The type of path to match.

	@default 'file'
	*/
	readonly type?: 'file' | 'directory';

	/**
	Allow symbolic links to match if they point to the requested path type.

	@default true
	*/
	readonly allowSymlinks?: boolean;
}

/* eslint-disable @typescript-eslint/unified-signatures */


/**
Return this in a `matcher` function to stop the search and force `findUp` to immediately return `undefined`.
*/
declare const findUpStop: unique symbol;

type Match = string | typeof findUpStop | undefined;

interface Options$3 extends Options$4 {
	/**
	The path to the directory to stop the search before reaching root if there were no matches before the `stopAt` directory.

	@default path.parse(cwd).root
	*/
	readonly stopAt?: string;
}

/**
Find a file or directory by walking up parent directories.

@param name - The name of the file or directory to find. Can be multiple.
@returns The first path found (by respecting the order of `name`s) or `undefined` if none could be found.

@example
```
// /
// └── Users
//     └── sindresorhus
//         ├── unicorn.png
//         └── foo
//             └── bar
//                 ├── baz
//                 └── example.js

// example.js
import {findUp} from 'find-up';

console.log(await findUp('unicorn.png'));
//=> '/Users/sindresorhus/unicorn.png'

console.log(await findUp(['rainbow.png', 'unicorn.png']));
//=> '/Users/sindresorhus/unicorn.png'
```
*/
declare function findUp(name: string | readonly string[], options?: Options$3): Promise<string | undefined>;

/**
Find a file or directory by walking up parent directories.

@param matcher - Called for each directory in the search. Return a path or `findUpStop` to stop the search.
@returns The first path found or `undefined` if none could be found.

@example
```
import path from 'node:path';
import {findUp, pathExists} from 'find-up';

console.log(await findUp(async directory => {
	const hasUnicorns = await pathExists(path.join(directory, 'unicorn.png'));
	return hasUnicorns && directory;
}, {type: 'directory'}));
//=> '/Users/sindresorhus'
```
*/
declare function findUp(matcher: (directory: string) => (Match | Promise<Match>), options?: Options$3): Promise<string | undefined>;

declare type ErrnoException$1 = NodeJS.ErrnoException;

declare type StatAsynchronousMethod = (path: string, callback: (error: ErrnoException$1 | null, stats: fs.Stats) => void) => void;
declare type StatSynchronousMethod = (path: string) => fs.Stats;
interface FileSystemAdapter$2 {
    lstat: StatAsynchronousMethod;
    stat: StatAsynchronousMethod;
    lstatSync: StatSynchronousMethod;
    statSync: StatSynchronousMethod;
}

interface Entry$2 {
    dirent: Dirent;
    name: string;
    path: string;
    stats?: Stats;
}
declare type Stats = fs.Stats;
declare type ErrnoException = NodeJS.ErrnoException;
interface Dirent {
    isBlockDevice: () => boolean;
    isCharacterDevice: () => boolean;
    isDirectory: () => boolean;
    isFIFO: () => boolean;
    isFile: () => boolean;
    isSocket: () => boolean;
    isSymbolicLink: () => boolean;
    name: string;
}

interface ReaddirAsynchronousMethod {
    (filepath: string, options: {
        withFileTypes: true;
    }, callback: (error: ErrnoException | null, files: Dirent[]) => void): void;
    (filepath: string, callback: (error: ErrnoException | null, files: string[]) => void): void;
}
interface ReaddirSynchronousMethod {
    (filepath: string, options: {
        withFileTypes: true;
    }): Dirent[];
    (filepath: string): string[];
}
declare type FileSystemAdapter$1 = FileSystemAdapter$2 & {
    readdir: ReaddirAsynchronousMethod;
    readdirSync: ReaddirSynchronousMethod;
};

declare type Entry$1 = Entry$2;

declare type Entry = Entry$1;
declare type Pattern = string;
declare type FileSystemAdapter = FileSystemAdapter$1;

declare type Options$2 = {
    /**
     * Return the absolute path for entries.
     *
     * @default false
     */
    absolute?: boolean;
    /**
     * If set to `true`, then patterns without slashes will be matched against
     * the basename of the path if it contains slashes.
     *
     * @default false
     */
    baseNameMatch?: boolean;
    /**
     * Enables Bash-like brace expansion.
     *
     * @default true
     */
    braceExpansion?: boolean;
    /**
     * Enables a case-sensitive mode for matching files.
     *
     * @default true
     */
    caseSensitiveMatch?: boolean;
    /**
     * Specifies the maximum number of concurrent requests from a reader to read
     * directories.
     *
     * @default os.cpus().length
     */
    concurrency?: number;
    /**
     * The current working directory in which to search.
     *
     * @default process.cwd()
     */
    cwd?: string;
    /**
     * Specifies the maximum depth of a read directory relative to the start
     * directory.
     *
     * @default Infinity
     */
    deep?: number;
    /**
     * Allow patterns to match entries that begin with a period (`.`).
     *
     * @default false
     */
    dot?: boolean;
    /**
     * Enables Bash-like `extglob` functionality.
     *
     * @default true
     */
    extglob?: boolean;
    /**
     * Indicates whether to traverse descendants of symbolic link directories.
     *
     * @default true
     */
    followSymbolicLinks?: boolean;
    /**
     * Custom implementation of methods for working with the file system.
     *
     * @default fs.*
     */
    fs?: Partial<FileSystemAdapter>;
    /**
     * Enables recursively repeats a pattern containing `**`.
     * If `false`, `**` behaves exactly like `*`.
     *
     * @default true
     */
    globstar?: boolean;
    /**
     * An array of glob patterns to exclude matches.
     * This is an alternative way to use negative patterns.
     *
     * @default []
     */
    ignore?: Pattern[];
    /**
     * Mark the directory path with the final slash.
     *
     * @default false
     */
    markDirectories?: boolean;
    /**
     * Returns objects (instead of strings) describing entries.
     *
     * @default false
     */
    objectMode?: boolean;
    /**
     * Return only directories.
     *
     * @default false
     */
    onlyDirectories?: boolean;
    /**
     * Return only files.
     *
     * @default true
     */
    onlyFiles?: boolean;
    /**
     * Enables an object mode (`objectMode`) with an additional `stats` field.
     *
     * @default false
     */
    stats?: boolean;
    /**
     * By default this package suppress only `ENOENT` errors.
     * Set to `true` to suppress any error.
     *
     * @default false
     */
    suppressErrors?: boolean;
    /**
     * Throw an error when symbolic link is broken if `true` or safely
     * return `lstat` call if `false`.
     *
     * @default false
     */
    throwErrorOnBrokenSymbolicLink?: boolean;
    /**
     * Ensures that the returned entries are unique.
     *
     * @default true
     */
    unique?: boolean;
};

declare type Task = {
    base: string;
    dynamic: boolean;
    patterns: Pattern[];
    positive: Pattern[];
    negative: Pattern[];
};

declare type EntryObjectModePredicate = {
    [TKey in keyof Pick<Options$2, 'objectMode'>]-?: true;
};
declare type EntryStatsPredicate = {
    [TKey in keyof Pick<Options$2, 'stats'>]-?: true;
};
declare type EntryObjectPredicate = EntryObjectModePredicate | EntryStatsPredicate;
declare function FastGlob(source: Pattern | Pattern[], options: Options$2 & EntryObjectPredicate): Promise<Entry[]>;
declare function FastGlob(source: Pattern | Pattern[], options?: Options$2): Promise<string[]>;
declare namespace FastGlob {
    type Options = Options$2;
    type Entry = Entry;
    type Task = Task;
    type Pattern = Pattern;
    type FileSystemAdapter = FileSystemAdapter;
    function sync(source: Pattern | Pattern[], options: Options$2 & EntryObjectPredicate): Entry[];
    function sync(source: Pattern | Pattern[], options?: Options$2): string[];
    function stream(source: Pattern | Pattern[], options?: Options$2): NodeJS.ReadableStream;
    function generateTasks(source: Pattern | Pattern[], options?: Options$2): Task[];
    function isDynamicPattern(source: Pattern, options?: Options$2): boolean;
    function escapePath(source: Pattern): Pattern;
}

declare const path_findUp: typeof findUp;
declare const path_basename: typeof basename;
declare const path_delimiter: typeof delimiter;
declare const path_dirname: typeof dirname;
declare const path_extname: typeof extname;
declare const path_format: typeof format;
declare const path_isAbsolute: typeof isAbsolute;
declare const path_join: typeof join;
declare const path_normalize: typeof normalize;
declare const path_normalizeString: typeof normalizeString;
declare const path_parse: typeof parse;
declare const path_relative: typeof relative;
declare const path_resolve: typeof resolve;
declare const path_sep: typeof sep;
declare const path_toNamespacedPath: typeof toNamespacedPath;
declare namespace path {
  export {
    path_findUp as findUp,
    FastGlob as glob,
    path_basename as basename,
    path_delimiter as delimiter,
    path_dirname as dirname,
    path_extname as extname,
    path_format as format,
    path_isAbsolute as isAbsolute,
    path_join as join,
    path_normalize as normalize,
    path_normalizeString as normalizeString,
    path_parse as parse,
    path_relative as relative,
    path_resolve as resolve,
    path_sep as sep,
    path_toNamespacedPath as toNamespacedPath,
  };
}

/**
 * Creates a temporary directory and ties its lifecycle ot the lifecycle of the callback.
 * @param callback - The callback that receives the temporary directory.
 */
declare function inTemporaryDirectory<T>(callback: (tmpDir: string) => T | Promise<T>): Promise<T>;
/**
 * It reads a file and returns its content as a string using the
 * utf-8 encoding
 * @param path {string} Path to the file to read.
 * @returns {Promise<string>} A promise that resolves with the content of the file.
 */
declare function read(path: string): Promise<string>;
/**
 * Copies a file
 * @param from {string} Path to the directory or file to be copied.
 * @param to {string} Destination path.
 */
declare function copy(from: string, to: string): Promise<void>;
declare function write(path: string, data: string): Promise<void>;
declare function append(path: string, data: string): Promise<void>;
declare function mkdir(path: string): Promise<void>;
declare function remove(path: string): Promise<void>;
declare function rmdir(path: string, { force }?: {
    force?: boolean;
}): Promise<void>;
declare function mkTmpDir(): Promise<string>;
declare function isDirectory(path: string): Promise<boolean>;
/**
 * Moves a file.
 * @param src {string} File to be moved.
 * @param dest {string} Path to be moved to.
 * @param options {object} Moving options.
 */
declare function move(src: string, dest: string, options?: {
    overwrite?: boolean;
}): Promise<void>;
/**
 * Changes the permissions of a directory or file.
 * @param path {string} Path to the file or directory whose permissions will be modified.
 * @param mode {string | numbers} Permissions to set to the file or directory.
 */
declare function chmod(path: string, mode: number | string): Promise<void>;
/**
 * Checks if a file has executable permissions.
 * @param path {string} Path to the file whose permissions will be checked.
 */
declare function hasExecutablePermissions(path: string): Promise<boolean>;
/**
 * Returns true if a file or directory exists
 * @param path {string} Path to the directory or file.
 * @returns {boolean} True if it exists.
 */
declare function exists(path: string): Promise<boolean>;

declare const file_inTemporaryDirectory: typeof inTemporaryDirectory;
declare const file_read: typeof read;
declare const file_copy: typeof copy;
declare const file_write: typeof write;
declare const file_append: typeof append;
declare const file_mkdir: typeof mkdir;
declare const file_remove: typeof remove;
declare const file_rmdir: typeof rmdir;
declare const file_mkTmpDir: typeof mkTmpDir;
declare const file_isDirectory: typeof isDirectory;
declare const file_move: typeof move;
declare const file_chmod: typeof chmod;
declare const file_hasExecutablePermissions: typeof hasExecutablePermissions;
declare const file_exists: typeof exists;
declare namespace file {
  export {
    file_inTemporaryDirectory as inTemporaryDirectory,
    file_read as read,
    file_copy as copy,
    file_write as write,
    file_append as append,
    file_mkdir as mkdir,
    file_remove as remove,
    file_rmdir as rmdir,
    file_mkTmpDir as mkTmpDir,
    file_isDirectory as isDirectory,
    file_move as move,
    file_chmod as chmod,
    file_hasExecutablePermissions as hasExecutablePermissions,
    file_exists as exists,
  };
}

declare const EMPTY_COMMANDS: [];
declare type EmptyTask = {
    commands: typeof EMPTY_COMMANDS;
    format: 'empty';
    parser: EmptyTaskParser;
    onError?: undefined;
};

declare type TaskResponseFormat = Buffer | string;
interface TaskParser<INPUT extends TaskResponseFormat, RESPONSE> {
    (stdOut: INPUT, stdErr: INPUT): RESPONSE;
}
interface EmptyTaskParser {
    (executor: SimpleGitExecutor): void;
}
interface SimpleGitTaskConfiguration<RESPONSE, FORMAT, INPUT extends TaskResponseFormat> {
    commands: string[];
    format: FORMAT;
    parser: TaskParser<INPUT, RESPONSE>;
    onError?: (result: GitExecutorResult, error: Error, done: (result: Buffer | Buffer[]) => void, fail: (error: string | Error) => void) => void;
}
declare type StringTask<R> = SimpleGitTaskConfiguration<R, 'utf-8', string>;
declare type BufferTask<R> = SimpleGitTaskConfiguration<R, 'buffer', Buffer>;
declare type RunnableTask<R> = StringTask<R> | BufferTask<R>;
declare type SimpleGitTask<R> = RunnableTask<R> | EmptyTask;

/**
 * The `GitError` is thrown when the underlying `git` process throws a
 * fatal exception (eg an `ENOENT` exception when attempting to use a
 * non-writable directory as the root for your repo), and acts as the
 * base class for more specific errors thrown by the parsing of the
 * git response or errors in the configuration of the task about to
 * be run.
 *
 * When an exception is thrown, pending tasks in the same instance will
 * not be executed. The recommended way to run a series of tasks that
 * can independently fail without needing to prevent future tasks from
 * running is to catch them individually:
 *
 * ```typescript
 import { gitP, SimpleGit, GitError, PullResult } from 'simple-git';

 function catchTask (e: GitError) {
   return e.
 }

 const git = gitP(repoWorkingDir);
 const pulled: PullResult | GitError = await git.pull().catch(catchTask);
 const pushed: string | GitError = await git.pushTags().catch(catchTask);
 ```
 */
declare class GitError extends Error {
    task?: EmptyTask | StringTask<any> | BufferTask<any> | undefined;
    constructor(task?: EmptyTask | StringTask<any> | BufferTask<any> | undefined, message?: string);
}

/**
 * The node-style callback to a task accepts either two arguments with the first as a null
 * and the second as the data, or just one argument which is an error.
 */
declare type SimpleGitTaskCallback<T = string, E extends GitError = GitError> = (err: E | null, data: T) => void;
/**
 * The event data emitted to the progress handler whenever progress detail is received.
 */
interface SimpleGitProgressEvent {
    /** The underlying method called - push, pull etc */
    method: string;
    /** The type of progress being reported, note that any one task may emit many stages - for example `git clone` emits both `receiving` and `resolving` */
    stage: 'compressing' | 'counting' | 'receiving' | 'resolving' | 'unknown' | 'writing' | string;
    /** The percent progressed as a number 0 - 100 */
    progress: number;
    /** The number of items processed so far */
    processed: number;
    /** The total number of items to be processed */
    total: number;
}

/**
 * Most tasks accept custom options as an array of strings as well as the
 * options object. Unless the task is explicitly documented as such, the
 * tasks will not accept both formats at the same time, preferring whichever
 * appears last in the arguments.
 */
declare type TaskOptions<O extends Options$1 = Options$1> = string[] | O;
/**
 * Options supplied in most tasks as an optional trailing object
 */
declare type OptionsValues = null | string | number;
declare type Options$1 = Record<string, OptionsValues>;
declare type OptionFlags<FLAGS extends string, VALUE = null> = Partial<Record<FLAGS, VALUE>>;
/**
 * A function called by the executor immediately after creating a child
 * process. Allows the calling application to implement custom handling of
 * the incoming stream of data from the `git`.
 */
declare type outputHandler = (command: string, stdout: NodeJS.ReadableStream, stderr: NodeJS.ReadableStream, args: string[]) => void;
/**
 * Environment variables to be passed into the child process.
 */
declare type GitExecutorEnv = NodeJS.ProcessEnv | undefined;
/**
 * Public interface of the Executor
 */
interface SimpleGitExecutor {
    env: GitExecutorEnv;
    outputHandler?: outputHandler;
    binary: string;
    cwd: string;
    chain(): SimpleGitExecutor;
    push<R>(task: SimpleGitTask<R>): Promise<R>;
}
/**
 * The resulting output from running the git child process
 */
interface GitExecutorResult {
    stdOut: Buffer[];
    stdErr: Buffer[];
    exitCode: number;
    rejection: Maybe<Error>;
}
interface SimpleGitPluginConfig {
    /**
     * Configures the events that should be used to determine when the unederlying child process has
     * been terminated.
     *
     * Version 2 will default to use `onClose=true, onExit=50` to mean the `close` event will be
     * used to immediately treat the child process as closed and start using the data from `stdOut`
     * / `stdErr`, whereas the `exit` event will wait `50ms` before treating the child process
     * as closed.
     *
     * This will be changed in version 3 to use `onClose=true, onExit=false` so that only the
     * close event is used to determine the termination of the process.
     */
    completion: {
        onClose?: boolean | number;
        onExit?: boolean | number;
    };
    /**
     * Configures the content of errors thrown by the `simple-git` instance for each task
     */
    errors(error: Buffer | Error | undefined, result: Omit<GitExecutorResult, 'rejection'>): Buffer | Error | undefined;
    /**
     * Handler to be called with progress events emitted through the progress plugin
     */
    progress(data: SimpleGitProgressEvent): void;
    /**
     * Configuration for the `timeoutPlugin`
     */
    timeout: {
        /**
         * The number of milliseconds to wait after spawning the process / receiving
         * content on the stdOut/stdErr streams before forcibly closing the git process.
         */
        block: number;
    };
    spawnOptions: Pick<SpawnOptions, 'uid' | 'gid'>;
}
/**
 * Optional configuration settings to be passed to the `simpleGit`
 * builder.
 */
interface SimpleGitOptions extends Partial<SimpleGitPluginConfig> {
    baseDir: string;
    binary: string;
    maxConcurrentProcesses: number;
    config: string[];
}
declare type Maybe<T> = T | undefined;

interface DefaultLogFields {
    hash: string;
    date: string;
    message: string;
    refs: string;
    body: string;
    author_name: string;
    author_email: string;
}
declare type LogOptions<T = DefaultLogFields> = {
    file?: string;
    format?: T;
    from?: string;
    mailMap?: boolean;
    maxCount?: number;
    multiLine?: boolean;
    splitter?: string;
    strictDate?: boolean;
    symmetric?: boolean;
    to?: string;
};

interface BranchSummaryBranch {
   current: boolean;
   name: string;
   commit: string;
   label: string;
}

interface BranchSummary {
   detached: boolean;
   current: string;
   all: string[];
   branches: {
      [key: string]: BranchSummaryBranch;
   };
}

/**
 * Represents the successful deletion of a single branch
 */
interface BranchSingleDeleteSuccess {
   branch: string;
   hash: string;
   success: true;
}

/**
 * Represents the failure to delete a single branch
 */
interface BranchSingleDeleteFailure {
   branch: string;
   hash: null;
   success: false;
}

type BranchSingleDeleteResult = BranchSingleDeleteFailure | BranchSingleDeleteSuccess;

/**
 * Represents the status of having deleted a batch of branches
 */
interface BranchMultiDeleteResult {
   /**
    * All branches included in the response
    */
   all: BranchSingleDeleteResult[];

   /**
    * Branches mapped by their branch name
    */
   branches: { [branchName: string]: BranchSingleDeleteResult };

   /**
    * Array of responses that are in error
    */
   errors: BranchSingleDeleteResult[];

   /**
    * Flag showing whether all branches were deleted successfully
    */
   readonly success: boolean;
}

interface CleanSummary {
   readonly dryRun: boolean;
   paths: string[];
   files: string[];
   folders: string[];
}

interface CommitResult {
   author: null | {
      email: string;
      name: string;
   };
   branch: string;
   commit: string;
   root: boolean;
   summary: {
      changes: number;
      insertions: number;
      deletions: number;
   };
}

/** Represents the response to using `git.getConfig` */
interface ConfigGetResult {
   /** The key that was searched for */
   key: string;

   /** The single value seen by `git` for this key (equivalent to `git config --get key`) */
   value: string | null;

   /** All possible values for this key no matter the scope (equivalent to `git config --get-all key`) */
   values: string[];

   /** The file paths from which configuration was read */
   paths: string[];

   /**
    * The full hierarchy of values the property can have had across the
    * various scopes that were searched (keys in this Map are the strings
    * also found in the `paths` array).
    */
   scopes: Map<string, string[]>;
}

/**
 * Represents the current git configuration, as defined by the output from `git log`
 */
interface ConfigListSummary {

   /**
    * All configuration settings, where local/user settings override user/global settings
    * the overridden value will appear in this object.
    */
   readonly all: ConfigValues;

   /**
    * The file paths configuration was read from
    */
   files: string[];

   /**
    * The `ConfigValues` for each of the `files`, use this object to determine
    * local repo, user and global settings.
    */
   values: { [fileName: string]: ConfigValues };
}

/**
 * Represents the map of configuration settings
 */
interface ConfigValues {
   [key: string]: string | string[];
}

interface DiffResultTextFile {
   file: string;
   changes: number;
   insertions: number;
   deletions: number;
   binary: false;
}

interface DiffResultBinaryFile {
   file: string;
   before: number;
   after: number;
   binary: true;
}

interface DiffResult {
   /** The total number of files changed as reported in the summary line */
   changed: number;

   /** When present in the diff, lists the details of each file changed */
   files: Array<DiffResultTextFile | DiffResultBinaryFile>;

   /** The number of files changed with insertions */
   insertions: number;

   /** The number of files changed with deletions */
   deletions: number;
}

interface FetchResult {
   raw: string;
   remote: string | null;
   branches: {
      name: string;
      tracking: string;
   }[];
   tags: {
      name: string;
      tracking: string;
   }[];
}

/** Represents the response to git.grep */
interface GrepResult {
   paths: Set<string>;
   results: Record<string, Array<{
      line: number;
      path: string;
      preview: string;
   }>>;
}

/**
 * The `InitResult` is returned when (re)initialising a git repo.
 */
interface InitResult {
   /**
    * Boolean representing whether the `--bare` option was used
    */
   readonly bare: boolean;

   /**
    * Boolean representing whether the repo already existed (re-initialised rather than initialised)
    */
   readonly existing: boolean;

   /**
    * The path used when initialising
    */
   readonly path: string;

   /**
    * The git configuration directory - for a bare repo this is the same as `path`, in non-bare repos
    * this will usually be a sub-directory with the name `.git` (or value of the `$GIT_DIR` environment
    * variable).
    */
   readonly gitDir: string;
}

/**
 * A parsed response summary for calls to `git mv`
 */
interface MoveResult {
   /**
    * Array of files moved
    */
   moves: Array<{ from: string, to: string }>;
}

interface PullDetailFileChanges {
   [fileName: string]: number;
}

interface PullDetailSummary {
   changes: number;
   insertions: number;
   deletions: number;
}

interface PullDetail {
   /** Array of all files that are referenced in the pull */
   files: string[];

   /** Map of file names to the number of insertions in that file */
   insertions: PullDetailFileChanges;

   /** Map of file names to the number of deletions in that file */
   deletions: PullDetailFileChanges;

   summary: PullDetailSummary;

   /** Array of file names that have been created */
   created: string[];

   /** Array of file names that have been deleted */
   deleted: string[];
}

interface PullResult extends PullDetail, RemoteMessageResult {
}

/**
 * Represents file name changes in a StatusResult
 */
interface StatusResultRenamed {
   from: string;
   to: string;
}

interface FileStatusResult {

   /** Original location of the file, when the file has been moved */
   from?: string

   /** Path of the file */
   path: string;

   /** First digit of the status code of the file, e.g. 'M' = modified.
    Represents the status of the index if no merge conflicts, otherwise represents
    status of one side of the merge. */
   index: string;

   /** Second digit of the status code of the file. Represents status of the working directory
    if no merge conflicts, otherwise represents status of other side of a merge. */
   working_dir: string;
}

/**
 * The StatusResult is returned for calls to `git.status()`, represents the state of the
 * working directory.
 */
interface StatusResult {
   not_added: string[];
   conflicted: string[];
   created: string[];
   deleted: string[];

   /**
    * Ignored files are not listed by default, add `--ignored` to the task options in order to see
    * this array of ignored files/paths.
    *
    * Note: ignored files will not be added to the `files` array, and will not be included in the
    * `isClean()` calculation.
    */
   ignored?: string[];
   modified: string[];
   renamed: StatusResultRenamed[];
   staged: string[];

   /**
    * All files represented as an array of objects containing the `path` and status in `index` and
    * in the `working_dir`.
    */
   files: FileStatusResult[];

   /**
    * Number of commits ahead of the tracked branch
    */
   ahead: number;

   /**
    *Number of commits behind the tracked branch
    */
   behind: number;

   /**
    * Name of the current branch
    */
   current: string | null;

   /**
    * Name of the branch being tracked
    */
   tracking: string | null;

   /**
    * Detached status of the working copy, for more detail of what the working branch
    * is detached from use `git.branch()`
    */
   detached: boolean;

   /**
    * Gets whether this represents a clean working branch.
    */
   isClean(): boolean;
}

/**
 * Response retrieved when using the `git.tags` method
 */
interface TagResult {
   /**
    * All tag names
    */
   all: string[];

   /**
    * The semver latest tag name or `undefined` when no tags are named in the response
    */
   latest: string | undefined;
}

/**
 * The ListLogLine represents a single entry in the `git.log`, the properties on the object
 * are mixed in depending on the names used in the format (see `DefaultLogFields`), but some
 * properties are dependent on the command used.
 */
interface ListLogLine {
   /**
    * When using a `--stat=4096` or `--shortstat` options in the `git.log` or `git.stashList`,
    * each entry in the `ListLogSummary` will also have a `diff` property representing as much
    * detail as was given in the response.
    */
   diff?: DiffResult;
}

interface LogResult<T = DefaultLogFields> {
   all: ReadonlyArray<T & ListLogLine>;
   total: number;
   latest: (T & ListLogLine) | null;
}

/**
 * Where the file was deleted, if there is a modify/delete conflict
 */
interface MergeConflictDeletion {
   deleteRef: string;
}

/**
 * Represents a single file with conflicts in the MergeSummary
 */
interface MergeConflict {

   /**
    * Type of conflict
    */
   reason: string;

   /**
    * Path to file
    */
   file: string | null;

   /**
    * Additional detail for the specific type of conflict
    */
   meta?: MergeConflictDeletion;
}

type MergeResultStatus = 'success' | string;

interface MergeDetail {
   conflicts: MergeConflict[];
   merges: string[];
   result: MergeResultStatus;
   readonly failed: boolean;
}

type MergeResult = PullResult & MergeDetail;

/**
 *
 */
interface PushResultPushedItem {
   local: string;
   remote: string;

   readonly deleted: boolean;
   readonly tag: boolean;
   readonly branch: boolean;
   readonly new: boolean;
   readonly alreadyUpdated: boolean;
}

interface RemoteMessagesObjectEnumeration {
   enumerating: number,
   counting: number,
   compressing: number,
   total: {
      count: number,
      delta: number,
   },
   reused: {
      count: number,
      delta: number,
   },
   packReused: number,
}

interface RemoteMessages {
   all: string[];
   objects?: RemoteMessagesObjectEnumeration;
}

interface PushResultRemoteMessages extends RemoteMessages {
   pullRequestUrl?: string;
   vulnerabilities?: {
      count: number;
      summary: string;
      url: string;
   };
}

interface RemoteMessageResult<T extends RemoteMessages = RemoteMessages> {
   remoteMessages: T;
}

interface PushResultBranchUpdate {
   head: {
      local: string;
      remote: string;
   };
   hash: {
      from: string;
      to: string;
   };
}

interface PushDetail {
   repo?: string;
   ref?: {
      local: string;
   };
   pushed: PushResultPushedItem[];
   branch?: {
      local: string;
      remote: string;
      remoteName: string;
   };
   update?: PushResultBranchUpdate;
}

interface PushResult extends PushDetail, RemoteMessageResult<PushResultRemoteMessages> {
}

type MoveSummary = MoveResult;

interface RemoteWithoutRefs {
    name: string;
}
interface RemoteWithRefs extends RemoteWithoutRefs {
    refs: {
        fetch: string;
        push: string;
    };
}

declare type ApplyOptions = Options$1 & OptionFlags<'--stat' | '--numstat' | '--summary' | '--check' | '--index' | '--intent-to-add' | '--3way' | '--apply' | '--no-add' | '-R' | '--reverse' | '--allow-binary-replacement' | '--binary' | '--reject' | '-z' | '--inaccurate-eof' | '--recount' | '--cached' | '--ignore-space-change' | '--ignore-whitespace' | '--verbose' | '--unsafe-paths'> & OptionFlags<'--whitespace', 'nowarn' | 'warn' | 'fix' | 'error' | 'error-all'> & OptionFlags<'--build-fake-ancestor' | '--exclude' | '--include' | '--directory', string> & OptionFlags<'-p' | '-C', number>;

declare enum CheckRepoActions {
    BARE = "bare",
    IN_TREE = "tree",
    IS_REPO_ROOT = "root"
}

/**
 * All supported option switches available for use in a `git.clean` operation
 */
declare enum CleanOptions {
    DRY_RUN = "n",
    FORCE = "f",
    IGNORED_INCLUDED = "x",
    IGNORED_ONLY = "X",
    EXCLUDING = "e",
    QUIET = "q",
    RECURSIVE = "d"
}
/**
 * The two modes `git.clean` can run in - one of these must be supplied in order
 * for the command to not throw a `TaskConfigurationError`
 */
declare type CleanMode = CleanOptions.FORCE | CleanOptions.DRY_RUN;

declare enum GitConfigScope {
    system = "system",
    global = "global",
    local = "local",
    worktree = "worktree"
}

interface GitGrepQuery extends Iterable<string> {
    /** Adds one or more terms to be grouped as an "and" to any other terms */
    and(...and: string[]): this;
    /** Adds one or more search terms - git.grep will "or" this to other terms */
    param(...param: string[]): this;
}

declare enum ResetMode {
    MIXED = "mixed",
    SOFT = "soft",
    HARD = "hard",
    MERGE = "merge",
    KEEP = "keep"
}
declare type ResetOptions = Options$1 & OptionFlags<'-q' | '--quiet' | '--no-quiet' | '--pathspec-from-nul'> & OptionFlags<'--pathspec-from-file', string>;

interface SimpleGitFactory {
   (baseDir?: string, options?: Partial<SimpleGitOptions>): SimpleGit;

   (baseDir: string): SimpleGit;

   (options: Partial<SimpleGitOptions>): SimpleGit;
}

type Response$2<T> = SimpleGit & Promise<T>;

interface SimpleGitBase {
   /**
    * Adds one or more files to source control
    */
   add(files: string | string[], callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Sets the working directory of the subsequent commands.
    */
   cwd(directory: { path: string, root?: boolean }, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   cwd<path extends string>(directory: path, callback?: SimpleGitTaskCallback<path>): Response$2<path>;

   /**
    * Compute object ID from a file
    */
   hashObject(path: string, callback?: SimpleGitTaskCallback): Response$2<string>;

   hashObject(path: string, write ?: boolean, callback?: SimpleGitTaskCallback): Response$2<string>;

   /**
    * Initialize a git repo
    */
   init(bare: boolean, options?: TaskOptions, callback?: SimpleGitTaskCallback<InitResult>): Response$2<InitResult>;

   init(bare: boolean, callback?: SimpleGitTaskCallback<InitResult>): Response$2<InitResult>;

   init(options?: TaskOptions, callback?: SimpleGitTaskCallback<InitResult>): Response$2<InitResult>;

   init(callback?: SimpleGitTaskCallback<InitResult>): Response$2<InitResult>;

   /**
    * Runs a merge, `options` can be either an array of arguments
    * supported by the [`git merge`](https://git-scm.com/docs/git-merge)
    * or an options object.
    *
    * Conflicts during the merge result in an error response,
    * the response type whether it was an error or success will be a MergeSummary instance.
    * When successful, the MergeSummary has all detail from a the PullSummary
    *
    * @see https://github.com/steveukx/git-js/blob/master/src/responses/MergeSummary.js
    * @see https://github.com/steveukx/git-js/blob/master/src/responses/PullSummary.js
    */
   merge(options: TaskOptions, callback?: SimpleGitTaskCallback<MergeResult>): Response$2<MergeResult>;

   /**
    * Merges from one branch to another, equivalent to running `git merge ${remote} ${branch}`, the `options` argument can
    * either be an array of additional parameters to pass to the command or null / omitted to be ignored.
    */
   mergeFromTo<E extends GitError>(remote: string, branch: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<MergeResult, E>): Response$2<MergeResult>;

   mergeFromTo<E extends GitError>(remote: string, branch: string, callback?: SimpleGitTaskCallback<MergeResult, E>): Response$2<MergeResult>;

   /**
    * Sets a handler function to be called whenever a new child process is created, the handler function will be called
    * with the name of the command being run and the stdout & stderr streams used by the ChildProcess.
    *
    * @example
    * require('simple-git')
    *    .outputHandler(function (command, stdout, stderr) {
    *       stdout.pipe(process.stdout);
    *    })
    *    .checkout('https://github.com/user/repo.git');
    *
    * @see https://nodejs.org/api/child_process.html#child_process_class_childprocess
    * @see https://nodejs.org/api/stream.html#stream_class_stream_readable
    */
   outputHandler(handler: outputHandler | void): this;

   /**
    * Pushes the current committed changes to a remote, optionally specify the names of the remote and branch to use
    * when pushing. Supply multiple options as an array of strings in the first argument - see examples below.
    */
   push(remote?: string, branch?: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   push(options?: TaskOptions, callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   push(callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   /**
    * Stash the local repo
    */
   stash(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   stash(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Show the working tree status.
    */
   status(options?: TaskOptions, callback?: SimpleGitTaskCallback<StatusResult>): Response$2<StatusResult>;

   status(callback?: SimpleGitTaskCallback<StatusResult>): Response$2<StatusResult>;

}

interface SimpleGit extends SimpleGitBase {

   /**
    * Add an annotated tag to the head of the current branch
    */
   addAnnotatedTag(tagName: string, tagMessage: string, callback?: SimpleGitTaskCallback<{ name: string }>): Response$2<{ name: string }>;

   /**
    * Add config to local git instance for the specified `key` (eg: user.name) and value (eg: 'your name').
    * Set `append` to true to append to rather than overwrite the key
    */
   addConfig(key: string, value: string, append?: boolean, scope?: keyof typeof GitConfigScope, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   addConfig(key: string, value: string, append?: boolean, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   addConfig(key: string, value: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Applies a patch to the repo
    */
   applyPatch(patches: string | string[], options: TaskOptions<ApplyOptions>, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   applyPatch(patches: string | string[], callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Configuration values visible to git in the current working directory
    */
   listConfig(scope: keyof typeof GitConfigScope, callback?: SimpleGitTaskCallback<ConfigListSummary>): Response$2<ConfigListSummary>;

   listConfig(callback?: SimpleGitTaskCallback<ConfigListSummary>): Response$2<ConfigListSummary>;

   /**
    * Adds a remote to the list of remotes.
    *
    * - `remoteName` Name of the repository - eg "upstream"
    * - `remoteRepo` Fully qualified SSH or HTTP(S) path to the remote repo
    * - `options` Optional additional settings permitted by the `git remote add` command, merged into the command prior to the repo name and remote url
    */
   addRemote(remoteName: string, remoteRepo: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   addRemote(remoteName: string, remoteRepo: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Add a lightweight tag to the head of the current branch
    */
   addTag(name: string, callback?: SimpleGitTaskCallback<{ name: string }>): Response$2<{ name: string }>;

   /**
    * Equivalent to `catFile` but will return the native `Buffer` of content from the git command's stdout.
    */
   binaryCatFile(options: string[], callback?: SimpleGitTaskCallback<any>): Response$2<any>;

   /**
    * List all branches
    */
   branch(options?: TaskOptions, callback?: SimpleGitTaskCallback<BranchSummary>): Response$2<BranchSummary>;

   /**
    * List of local branches
    */
   branchLocal(callback?: SimpleGitTaskCallback<BranchSummary>): Response$2<BranchSummary>;

   /**
    * Returns a list of objects in a tree based on commit hash.
    * Passing in an object hash returns the object's content, size, and type.
    *
    * Passing "-p" will instruct cat-file to determine the object type, and display its formatted contents.
    *
    * @see https://git-scm.com/docs/git-cat-file
    */
   catFile(options: string[], callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   catFile(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Check if a pathname or pathnames are excluded by .gitignore
    *
    */
   checkIgnore(pathNames: string[], callback?: SimpleGitTaskCallback<string[]>): Response$2<string[]>;

   checkIgnore(path: string, callback?: SimpleGitTaskCallback<string[]>): Response$2<string[]>;

   /**
    * Validates that the current working directory is a valid git repo file path.
    *
    * To make a more specific assertion of the repo, add the `action` argument:
    *
    * - `bare` to validate that the working directory is inside a bare repo.
    * - `root` to validate that the working directory is the root of a repo.
    * - `tree` (default value when omitted) to simply validate that the working
    *    directory is the descendent of a repo
    */
   checkIsRepo(action?: CheckRepoActions, callback?: SimpleGitTaskCallback<boolean>): Response$2<boolean>;

   checkIsRepo(callback?: SimpleGitTaskCallback<boolean>): Response$2<boolean>;

   /**
    * Checkout a tag or revision, any number of additional arguments can be passed to the `git checkout` command
    * by supplying either a string or array of strings as the `what` parameter.
    */
   checkout(what: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   checkout(what: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   checkout(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Checkout a remote branch.
    *
    * - branchName name of branch.
    * - startPoint (e.g origin/development).
    */
   checkoutBranch(branchName: string, startPoint: string, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Internally uses pull and tags to get the list of tags then checks out the latest tag.
    */
   checkoutLatestTag(branchName: string, startPoint: string, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Checkout a local branch
    */
   checkoutLocalBranch(branchName: string, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Deletes unwanted content from the local repo - when supplying the first argument as
    * an array of `CleanOptions`, the array must include one of `CleanOptions.FORCE` or
    * `CleanOptions.DRY_RUN`.
    *
    * eg:
    *
    * ```typescript
    await git.clean(CleanOptions.FORCE);
    await git.clean(CleanOptions.DRY_RUN + CleanOptions.RECURSIVE);
    await git.clean(CleanOptions.FORCE, ['./path']);
    await git.clean(CleanOptions.IGNORED + CleanOptions.FORCE, {'./path': null});
    * ```
    */
   clean(args: CleanOptions[], options?: TaskOptions, callback?: SimpleGitTaskCallback<CleanSummary>): Response$2<CleanSummary>;

   clean(mode: CleanMode | string, options?: TaskOptions, callback?: SimpleGitTaskCallback<CleanSummary>): Response$2<CleanSummary>;

   clean(mode: CleanMode | string, callback?: SimpleGitTaskCallback<CleanSummary>): Response$2<CleanSummary>;

   clean(options?: TaskOptions): Response$2<CleanSummary>;

   clean(callback?: SimpleGitTaskCallback<CleanSummary>): Response$2<CleanSummary>;

   /**
    * Clears the queue of pending commands and returns the wrapper instance for chaining.
    */
   clearQueue(): this;

   /**
    * Clone a repository into a new directory.
    *
    * - repoPath repository url to clone e.g. https://github.com/steveukx/git-js.git
    * -  localPath local folder path to clone to.
    * - options supported by [git](https://git-scm.com/docs/git-clone).
    */
   clone(repoPath: string, localPath: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   clone(repoPath: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
    * files will be committed.
    */
   commit(
      message: string | string[],
      files?: string | string[],
      options?: Options$1,
      callback?: SimpleGitTaskCallback<CommitResult>): Response$2<CommitResult>;

   commit(
      message: string | string[],
      options?: TaskOptions,
      callback?: SimpleGitTaskCallback<CommitResult>): Response$2<CommitResult>;

   commit(
      message: string | string[],
      files?: string | string[],
      callback?: SimpleGitTaskCallback<CommitResult>): Response$2<CommitResult>;

   commit(
      message: string | string[],
      callback?: SimpleGitTaskCallback<CommitResult>): Response$2<CommitResult>;

   /**
    * Sets the path to a custom git binary, should either be `git` when there is an installation of git available on
    * the system path, or a fully qualified path to the executable.
    */
   customBinary(command: string): this;

   /**
    * Delete one local branch. Supply the branchName as a string to return a
    * single `BranchDeletionSummary` instances.
    *
    * - branchName name of branch
    * - forceDelete (optional, defaults to false) set to true to forcibly delete unmerged branches
    */
   deleteLocalBranch(branchName: string, forceDelete?: boolean, callback?: SimpleGitTaskCallback<BranchSingleDeleteResult>): Response$2<BranchSingleDeleteResult>;

   deleteLocalBranch(branchName: string, callback?: SimpleGitTaskCallback<BranchSingleDeleteResult>): Response$2<BranchSingleDeleteResult>;

   /**
    * Delete one or more local branches. Supply the branchName as a string to return a
    * single `BranchDeletionSummary` or as an array of branch names to return an array of
    * `BranchDeletionSummary` instances.
    *
    * - branchNames name of branch or array of branch names
    * - forceDelete (optional, defaults to false) set to true to forcibly delete unmerged branches
    */
   deleteLocalBranches(branchNames: string[], forceDelete?: boolean, callback?: SimpleGitTaskCallback<BranchMultiDeleteResult>): Response$2<BranchMultiDeleteResult>;

   /**
    * Get the diff of the current repo compared to the last commit with a set of options supplied as a string.
    */
   diff(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Gets a summary of the diff for files in the repo, uses the `git diff --stat` format to calculate changes.
    *
    * in order to get staged (only): `--cached` or `--staged`.
    */
   diffSummary(command: string | number, options: TaskOptions, callback?: SimpleGitTaskCallback<DiffResult>): Response$2<DiffResult>;

   diffSummary(command: string | number, callback?: SimpleGitTaskCallback<DiffResult>): Response$2<DiffResult>;

   diffSummary(options: TaskOptions, callback?: SimpleGitTaskCallback<DiffResult>): Response$2<DiffResult>;

   diffSummary(callback?: SimpleGitTaskCallback<DiffResult>): Response$2<DiffResult>;

   /**
    * Sets an environment variable for the spawned child process, either supply both a name and value as strings or
    * a single object to entirely replace the current environment variables.
    *
    * @param {string|Object} name
    * @param {string} [value]
    */
   env(name: string, value: string): this;

   env(env: object): this;

   /**
    * Calls the supplied `handle` function at the next step in the chain, used to run arbitrary functions synchronously
    * before the next task in the git api.
    */
   exec(handle: () => void): Response$2<void>;

   /**
    * Updates the local working copy database with changes from the default remote repo and branch.
    */
   fetch(remote: string, branch: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<FetchResult>): Response$2<FetchResult>;

   fetch(remote: string, branch: string, callback?: SimpleGitTaskCallback<FetchResult>): Response$2<FetchResult>;

   fetch(remote: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<FetchResult>): Response$2<FetchResult>;

   fetch(options?: TaskOptions, callback?: SimpleGitTaskCallback<FetchResult>): Response$2<FetchResult>;

   fetch(callback?: SimpleGitTaskCallback<FetchResult>): Response$2<FetchResult>;

   /**
    * Gets the current value of a configuration property by it key, optionally specify the scope in which
    * to run the command (omit / set to `undefined` to check in the complete overlaid configuration visible
    * to the `git` process).
    */
   getConfig(key: string, scope?: keyof typeof GitConfigScope, callback?: SimpleGitTaskCallback<string>): Response$2<ConfigGetResult>;

   /**
    * Gets the currently available remotes, setting the optional verbose argument to true includes additional
    * detail on the remotes themselves.
    */
   getRemotes(callback?: SimpleGitTaskCallback<RemoteWithoutRefs[]>): Response$2<RemoteWithoutRefs[]>;

   getRemotes(verbose?: false, callback?: SimpleGitTaskCallback<RemoteWithoutRefs[]>): Response$2<RemoteWithoutRefs[]>;

   getRemotes(verbose: true, callback?: SimpleGitTaskCallback<RemoteWithRefs[]>): Response$2<RemoteWithRefs[]>;

   /**
    * Search for files matching the supplied search terms
    */
   grep(searchTerm: string | GitGrepQuery, callback?: SimpleGitTaskCallback<GrepResult>): Response$2<GrepResult>;

   grep(searchTerm: string | GitGrepQuery, options?: TaskOptions, callback?: SimpleGitTaskCallback<GrepResult>): Response$2<GrepResult>;

   /**
    * List remotes by running the `ls-remote` command with any number of arbitrary options
    * in either array of object form.
    */
   listRemote(args?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Show commit logs from `HEAD` to the first commit.
    * If provided between `options.from` and `options.to` tags or branch.
    *
    * You can provide `options.file`, which is the path to a file in your repository. Then only this file will be considered.
    *
    * To use a custom splitter in the log format, set `options.splitter` to be the string the log should be split on.
    *
    * By default the following fields will be part of the result:
    *   `hash`: full commit hash
    *   `date`: author date, ISO 8601-like format
    *   `message`: subject + ref names, like the --decorate option of git-log
    *   `author_name`: author name
    *   `author_email`: author mail
    * You can specify `options.format` to be an mapping from key to a format option like `%H` (for commit hash).
    * The fields specified in `options.format` will be the fields in the result.
    *
    * Options can also be supplied as a standard options object for adding custom properties supported by the git log command.
    * For any other set of options, supply options as an array of strings to be appended to the git log command.
    *
    * @returns Response<ListLogSummary>
    *
    * @see https://git-scm.com/docs/git-log
    */
   log<T = DefaultLogFields>(options?: TaskOptions | LogOptions<T>, callback?: SimpleGitTaskCallback<LogResult<T>>): Response$2<LogResult<T>>;

   /**
    * Mirror a git repo
    *
    * Equivalent to `git.clone(repoPath, localPath, ['--mirror'])`, `clone` allows
    * for additional task options.
    */
   mirror(repoPath: string, localPath: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Moves one or more files to a new destination.
    *
    * @see https://git-scm.com/docs/git-mv
    */
   mv(from: string | string[], to: string, callback?: SimpleGitTaskCallback<MoveSummary>): Response$2<MoveSummary>;

   /**
    * Fetch from and integrate with another repository or a local branch. In the case that the `git pull` fails with a
    * recognised fatal error, the exception thrown by this function will be a `GitResponseError<PullFailedResult>`.
    */
   pull(remote?: string, branch?: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<PullResult>): Response$2<PullResult>;

   pull(options?: TaskOptions, callback?: SimpleGitTaskCallback<PullResult>): Response$2<PullResult>;

   pull(callback?: SimpleGitTaskCallback<PullResult>): Response$2<PullResult>;

   /**
    * Pushes the current tag changes to a remote which can be either a URL or named remote. When not specified uses the
    * default configured remote spec.
    */
   pushTags(remote: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   pushTags(options?: TaskOptions, callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   pushTags(callback?: SimpleGitTaskCallback<PushResult>): Response$2<PushResult>;

   /**
    * Executes any command against the git binary.
    */
   raw(commands: string | string[] | TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(...commands: string[]): Response$2<string>;

   // leading varargs with trailing options/callback
   raw(a: string, options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, d: string, options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, d: string, e: string, options: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   // leading varargs with trailing callback
   raw(a: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, d: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   raw(a: string, b: string, c: string, d: string, e: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Rebases the current working copy. Options can be supplied either as an array of string parameters
    * to be sent to the `git rebase` command, or a standard options object.
    */
   rebase(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   rebase(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Call any `git remote` function with arguments passed as an array of strings.
    */
   remote(options: string[], callback?: SimpleGitTaskCallback<void | string>): Response$2<void | string>;

   /**
    * Removes an entry from the list of remotes.
    *
    * - remoteName Name of the repository - eg "upstream"
    */
   removeRemote(remoteName: string, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Reset a repo. Called without arguments this is a soft reset for the whole repo,
    * for explicitly setting the reset mode, supply the first argument as one of the
    * supported reset modes.
    *
    * Trailing options argument can be either a string array, or an extension of the
    * ResetOptions, use this argument for supplying arbitrary additional arguments,
    * such as restricting the pathspec.
    *
    * ```typescript
    // equivalent to each other
    simpleGit().reset(ResetMode.HARD, ['--', 'my-file.txt']);
    simpleGit().reset(['--hard', '--', 'my-file.txt']);
    simpleGit().reset(ResetMode.HARD, {'--': null, 'my-file.txt': null});
    simpleGit().reset({'--hard': null, '--': null, 'my-file.txt': null});
    ```
    */
   reset(mode: ResetMode, options?: TaskOptions<ResetOptions>, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   reset(mode: ResetMode, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   reset(options?: TaskOptions<ResetOptions>, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Revert one or more commits in the local working copy
    *
    * - commit The commit to revert. Can be any hash, offset (eg: `HEAD~2`) or range (eg: `master~5..master~2`)
    */
   revert(commit: String, options?: TaskOptions, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   revert(commit: String, callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Passes the supplied options to `git rev-parse` and returns the string response. Options can be either a
    * string array or `Options` object of options compatible with the [rev-parse](https://git-scm.com/docs/git-rev-parse)
    *
    * Example uses of `rev-parse` include converting friendly commit references (ie: branch names) to SHA1 hashes
    * and retrieving meta details about the current repo (eg: the root directory, and whether it was created as
    * a bare repo).
    */
   revparse(option: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   revparse(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Removes the named files from source control.
    */
   rm(paths: string | string[], callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Removes the named files from source control but keeps them on disk rather than deleting them entirely. To
    * completely remove the files, use `rm`.
    */
   rmKeepLocal(paths: string | string[], callback?: SimpleGitTaskCallback<void>): Response$2<void>;

   /**
    * Show various types of objects, for example the file at a certain commit
    */
   show(option: string | TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   show(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * @deprecated
    *
    * From version 2.7.0, use of `silent` is deprecated in favour of using the `debug` library, this method will
    * be removed in version 3.x.
    *
    * Please see the [readme](https://github.com/steveukx/git-js/blob/master/readme.md#enable-logging) for more details.
    *
    * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
    * a production environment.
    *
    * @param {boolean} silence
    */
   silent(silence?: boolean): this;

   /**
    * List the stash(s) of the local repo
    */
   stashList(options?: TaskOptions, callback?: SimpleGitTaskCallback<LogResult>): Response$2<LogResult>;

   stashList(callback?: SimpleGitTaskCallback<LogResult>): Response$2<LogResult>;

   /**
    * Call any `git submodule` function with arguments passed as an array of strings.
    */
   subModule(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Add a submodule
    */
   submoduleAdd(repo: string, path: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Initialise submodules
    */
   submoduleInit(moduleName: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleInit(moduleName: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleInit(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleInit(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Update submodules
    */
   submoduleUpdate(moduleName: string, options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleUpdate(moduleName: string, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleUpdate(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   submoduleUpdate(callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * List all tags. When using git 2.7.0 or above, include an options object with `"--sort": "property-name"` to
    * sort the tags by that property instead of using the default semantic versioning sort.
    *
    * Note, supplying this option when it is not supported by your Git version will cause the operation to fail.
    */
   tag(options?: TaskOptions, callback?: SimpleGitTaskCallback<string>): Response$2<string>;

   /**
    * Gets a list of tagged versions.
    */
   tags(options?: TaskOptions, callback?: SimpleGitTaskCallback<TagResult>): Response$2<TagResult>;

   tags(callback?: SimpleGitTaskCallback<TagResult>): Response$2<TagResult>;

   /**
    * Updates repository server info
    */
   updateServerInfo(callback?: SimpleGitTaskCallback<string>): Response$2<string>;
}

declare const factory: SimpleGitFactory;

declare const git_factory: typeof factory;
declare namespace git {
  export {
    git_factory as factory,
  };
}

declare enum ContentTokenType {
    Command = 0,
    Path = 1,
    Link = 2,
    Yellow = 3,
    Cyan = 4,
    Magenta = 5,
    Green = 6
}
interface ContentMetadata {
    link?: string;
}
declare class ContentToken {
    type: ContentTokenType;
    value: string;
    metadata: ContentMetadata;
    constructor(value: string, metadata: ContentMetadata | undefined, type: ContentTokenType);
}
declare const token: {
    command: (value: string) => ContentToken;
    path: (value: string) => ContentToken;
    link: (value: string, link: string) => ContentToken;
    cyan: (value: string) => ContentToken;
    yellow: (value: string) => ContentToken;
    magenta: (value: string) => ContentToken;
    green: (value: string) => ContentToken;
};
declare class TokenizedString {
    value: string;
    constructor(value: string);
}
declare type Message = string | TokenizedString;
declare function content(strings: TemplateStringsArray, ...keys: (ContentToken | string)[]): TokenizedString;
/** Log levels */
declare type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
/**
 *
 * @returns {LogLevel} It returns the log level set by the user.
 */
declare const currentLogLevel: () => LogLevel;
declare const shouldOutput: (logLevel: LogLevel) => boolean;
/**
 * Ouputs information to the user. This is akin to "console.log"
 * Info messages don't get additional formatting.
 * Note: Info messages are sent through the standard output.
 * @param content {string} The content to be output to the user.
 */
declare const info: (content: Message) => void;
/**
 * Outputs a success message to the user.
 * Success message receive a special formatting to make them stand out in the console.
 * Note: Success messages are sent through the standard output.
 * @param content {string} The content to be output to the user.
 */
declare const success: (content: Message) => void;
/**
 * Ouputs debug information to the user. By default these output is hidden unless the user calls the CLI with --verbose.
 * Debug messages don't get additional formatting.
 * Note: Debug messages are sent through the standard output.
 * @param content {string} The content to be output to the user.
 */
declare const debug: (content: Message) => void;
/**
 * Outputs a warning message to the user.
 * Warning messages receive a special formatting to make them stand out in the console.
 * Note: Warning messages are sent through the standard output.
 * @param content {string} The content to be output to the user.
 */
declare const warn: (content: Message) => void;
/**
 * Prints a new line in the terminal.
 */
declare const newline: () => void;
/**
 * Formats and outputs a fatal error.
 * Note: This API is not intended to be used internally. If you want to
 * abort the execution due to an error, raise a fatal error and let the
 * error handler handle and format it.
 * @param content {Fatal} The fatal error to be output.
 */
declare const error: (content: Fatal) => void;
declare function stringifyMessage(message: Message): string;
/**
 * Use this function when you have multiple concurrent processes that send data events
 * and we need to output them ensuring that they can visually differenciated by the user.
 *
 * @param index {number} The index of the process being run. This is used to determine the color.
 * @param prefix {string} The prefix to include in the standard output data to differenciate logs.
 * @param process The callback that's called with a Writable instance to send events through.
 */
declare function concurrent(index: number, prefix: string, action: (stdout: Writable, stderr: Writable) => Promise<void>): Promise<void>;

declare const output$1_token: typeof token;
type output$1_Message = Message;
declare const output$1_content: typeof content;
type output$1_LogLevel = LogLevel;
declare const output$1_currentLogLevel: typeof currentLogLevel;
declare const output$1_shouldOutput: typeof shouldOutput;
declare const output$1_info: typeof info;
declare const output$1_success: typeof success;
declare const output$1_debug: typeof debug;
declare const output$1_warn: typeof warn;
declare const output$1_newline: typeof newline;
declare const output$1_error: typeof error;
declare const output$1_stringifyMessage: typeof stringifyMessage;
declare const output$1_concurrent: typeof concurrent;
declare namespace output$1 {
  export {
    output$1_token as token,
    output$1_Message as Message,
    output$1_content as content,
    output$1_LogLevel as LogLevel,
    output$1_currentLogLevel as currentLogLevel,
    output$1_shouldOutput as shouldOutput,
    output$1_info as info,
    output$1_success as success,
    output$1_debug as debug,
    output$1_warn as warn,
    output$1_newline as newline,
    output$1_error as error,
    output$1_stringifyMessage as stringifyMessage,
    output$1_concurrent as concurrent,
  };
}

declare enum DependencyManager {
    Npm = "npm",
    Yarn = "yarn",
    Pnpm = "pnpm"
}
declare const dependencyManager: string[];
/**
 * Returns the dependency manager used to run the create workflow.
 * @param env {Object} The environment variables of the process in which the CLI runs.
 * @returns The dependency manager
 */
declare function dependencyManagerUsedForCreating(env?: NodeJS.ProcessEnv): DependencyManager;
/**
 * Installs the dependencies in the given directory.
 * @param directory {string} The directory that contains the package.json
 * @param dependencyManager {DependencyManager} The dependency manager to use to install the dependencies.
 * @param stdout {Writable} Standard output stream.
 * @returns stderr {Writable} Standard error stream.
 */
declare function install(directory: string, dependencyManager: DependencyManager, stdout?: Writable, stderr?: Writable): Promise<void>;

type dependency_DependencyManager = DependencyManager;
declare const dependency_DependencyManager: typeof DependencyManager;
declare const dependency_dependencyManager: typeof dependencyManager;
declare const dependency_dependencyManagerUsedForCreating: typeof dependencyManagerUsedForCreating;
declare const dependency_install: typeof install;
declare namespace dependency {
  export {
    dependency_DependencyManager as DependencyManager,
    dependency_dependencyManager as dependencyManager,
    dependency_dependencyManagerUsedForCreating as dependencyManagerUsedForCreating,
    dependency_install as install,
  };
}

/**
 * Returns the latest available version of an NPM package.
 * @param name {string} The name of the NPM package.
 * @returns A promise to get the latest available version of a package.
 */
declare function latestNpmPackageVersion(name: string): Promise<string>;

declare const version_latestNpmPackageVersion: typeof latestNpmPackageVersion;
declare namespace version {
  export {
    version_latestNpmPackageVersion as latestNpmPackageVersion,
  };
}

declare const username: (platform?: typeof platform) => Promise<string | null>;
/**
 * Returns the platform and architecture.
 * @returns {{platform: string, arch: string}} Returns the current platform and architecture.
 */
declare const platformAndArch: (platform?: typeof platform) => {
    platform: string;
    arch: string;
};

declare const os_username: typeof username;
declare const os_platformAndArch: typeof platformAndArch;
declare namespace os {
  export {
    os_username as username,
    os_platformAndArch as platformAndArch,
  };
}

/**
 * Returns true if the CLI is running in debug mode.
 * @param env The environment variables from the environment of the current process.
 * @returns true if SHOPIFY_CONFIG is debug
 */
declare function isDebug(env?: NodeJS.ProcessEnv): boolean;
/**
 * Returns true if the environment in which the CLI is running is either
 * a local environment (where dev is present) or a cloud environment (spin).
 * @returns {boolean} True if the CLI is used in a Shopify environment.
 */
declare function isShopify(env?: NodeJS.ProcessEnv): Promise<boolean>;

declare const local_isDebug: typeof isDebug;
declare const local_isShopify: typeof isShopify;
declare namespace local {
  export {
    local_isDebug as isDebug,
    local_isShopify as isShopify,
  };
}

/**
 * Enum that represents the environment to use for a given service.
 * @readonly
 * @enum {number}
 */
declare enum Environment {
    Local = "local",
    Production = "production",
    Spin = "spin"
}

/**
 * Returns the environment to be used for the interactions with the partners' CLI API.
 * @param env The environment variables from the environment of the current process.
 */
declare function partners$2(env?: NodeJS.ProcessEnv): Environment;
/**
 * Returns the environment to be used for the interactions with the admin API.
 * @param env The environment variables from the environment of the current process.
 */
declare function shopify$1(env?: NodeJS.ProcessEnv): Environment;
/**
 * Returns the environment to be used for the interactions with identity.
 * @param env The environment variables from the environment of the current process.
 */
declare function identity$1(env?: NodeJS.ProcessEnv): Environment;

declare namespace service {
  export {
    partners$2 as partners,
    shopify$1 as shopify,
    identity$1 as identity,
  };
}

declare const CouldntObtainPartnersSpinFQDNError: Abort;
declare const CouldntObtainIdentitySpinFQDNError: Abort;
declare const CouldntObtainShopifySpinFQDNError: Abort;
declare const NotProvidedStoreFQDNError: Abort;
/**
 * It returns the Partners' API service we should interact with.
 * @returns {string} Fully-qualified domain of the partners service we should interact with.
 */
declare function partners$1(): Promise<string>;
/**
 * It returns the Identity service we should interact with.
 * @returns {string} Fully-qualified domain of the Identity service we should interact with.
 */
declare function identity(): Promise<string>;
/**
 * It returns the Shopify service we should interact with.
 * Note the same fqdn is sued for the Admin and the Storefront Renderer APIs.
 * @returns {string} Fully-qualified domain of the Shopify service we should interact with.
 */
declare function shopify(options?: {
    storeFqdn?: string;
}): Promise<string>;

declare const fqdn_CouldntObtainPartnersSpinFQDNError: typeof CouldntObtainPartnersSpinFQDNError;
declare const fqdn_CouldntObtainIdentitySpinFQDNError: typeof CouldntObtainIdentitySpinFQDNError;
declare const fqdn_CouldntObtainShopifySpinFQDNError: typeof CouldntObtainShopifySpinFQDNError;
declare const fqdn_NotProvidedStoreFQDNError: typeof NotProvidedStoreFQDNError;
declare const fqdn_identity: typeof identity;
declare const fqdn_shopify: typeof shopify;
declare namespace fqdn {
  export {
    fqdn_CouldntObtainPartnersSpinFQDNError as CouldntObtainPartnersSpinFQDNError,
    fqdn_CouldntObtainIdentitySpinFQDNError as CouldntObtainIdentitySpinFQDNError,
    fqdn_CouldntObtainShopifySpinFQDNError as CouldntObtainShopifySpinFQDNError,
    fqdn_NotProvidedStoreFQDNError as NotProvidedStoreFQDNError,
    partners$1 as partners,
    fqdn_identity as identity,
    fqdn_shopify as shopify,
  };
}

declare const environment_local: typeof local;
declare const environment_service: typeof service;
declare const environment_fqdn: typeof fqdn;
declare namespace environment {
  export {
    environment_local as local,
    environment_service as service,
    environment_fqdn as fqdn,
  };
}

/**
 * A scope supported by the Shopify Admin API.
 */
declare type AdminAPIScope = 'graphql' | 'themes' | 'collaborator' | string;
/**
 * It represents the options to authenticate against the Shopify Admin API.
 */
interface AdminAPIOAuthOptions {
    /** Store to request permissions for */
    storeFqdn: string;
    /** List of scopes to request permissions for */
    scopes: AdminAPIScope[];
}
/**
 * A scope supported by the Partners API.
 */
declare type PartnersAPIScope = 'cli' | string;
interface PartnersAPIOAuthOptions {
    /** List of scopes to request permissions for */
    scopes: PartnersAPIScope[];
}
/**
 * A scope supported by the Storefront Renderer API.
 */
declare type StorefrontRendererScope = 'devtools' | string;
interface StorefrontRendererAPIOAuthOptions {
    /** List of scopes to request permissions for */
    scopes: StorefrontRendererScope[];
}
/**
 * It represents the authentication requirements and
 * is the input necessary to trigger the authentication
 * flow.
 */
interface OAuthApplications {
    adminApi?: AdminAPIOAuthOptions;
    storefrontRendererApi?: StorefrontRendererAPIOAuthOptions;
    partnersApi?: PartnersAPIOAuthOptions;
}
interface OAuthSession {
    admin?: string;
    partners?: string;
    storefront?: string;
}
/**
 * Ensure that we have a valid session to access the Partners API.
 * If SHOPIFY_CLI_PARTNERS_TOKEN exists, that token will be used to obtain a valid Partners Token
 * If SHOPIFY_CLI_PARTNERS_TOKEN exists, scopes will be ignored
 * @param scopes {string[]} Optional array of extra scopes to authenticate with.
 * @returns {Promise<string>} The access token for the Partners API.
 */
declare function ensureAuthenticatedPartners(scopes?: string[], env?: NodeJS.ProcessEnv): Promise<string>;
/**
 * Ensure that we have a valid session to access the Storefront API.
 * @param scopes {string[]} Optional array of extra scopes to authenticate with.
 * @returns {Promise<string>} The access token for the Storefront API.
 */
declare function ensureAuthenticatedStorefront(scopes?: string[]): Promise<string>;
/**
 * Ensure that we have a valid Admin session for the given store.
 * @param store {string} Store fqdn to request auth for
 * @param scopes {string[]} Optional array of extra scopes to authenticate with.
 * @returns {Promise<string>} The access token for the Admin API
 */
declare function ensureAuthenticatedAdmin(store: string, scopes?: string[]): Promise<string>;
/**
 * This method ensures that we have a valid session to authenticate against the given applications using the provided scopes.
 * @param applications {OAuthApplications} An object containing the applications we need to be authenticated with.
 * @returns {OAuthSession} An instance with the access tokens organized by application.
 */
declare function ensureAuthenticated(applications: OAuthApplications, env?: NodeJS.ProcessEnv): Promise<OAuthSession>;

type session_OAuthApplications = OAuthApplications;
type session_OAuthSession = OAuthSession;
declare const session_ensureAuthenticatedPartners: typeof ensureAuthenticatedPartners;
declare const session_ensureAuthenticatedStorefront: typeof ensureAuthenticatedStorefront;
declare const session_ensureAuthenticatedAdmin: typeof ensureAuthenticatedAdmin;
declare const session_ensureAuthenticated: typeof ensureAuthenticated;
declare namespace session {
  export {
    session_OAuthApplications as OAuthApplications,
    session_OAuthSession as OAuthSession,
    session_ensureAuthenticatedPartners as ensureAuthenticatedPartners,
    session_ensureAuthenticatedStorefront as ensureAuthenticatedStorefront,
    session_ensureAuthenticatedAdmin as ensureAuthenticatedAdmin,
    session_ensureAuthenticated as ensureAuthenticated,
  };
}

declare type Primitive = string | number | bigint | boolean | null | undefined;
declare type Scalars = Primitive | Primitive[];

declare namespace util {
    type AssertEqual<T, Expected> = [T] extends [Expected] ? [Expected] extends [T] ? true : false : false;
    function assertNever(_x: never): never;
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
    type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    const arrayToEnum: <T extends string, U extends [T, ...T[]]>(items: U) => { [k in U[number]]: k; };
    const getValidEnumValues: (obj: any) => any[];
    const objectValues: (obj: any) => any[];
    const objectKeys: ObjectConstructor["keys"];
    const find: <T>(arr: T[], checker: (arg: T) => any) => T | undefined;
    type identity<T> = T;
    type flatten<T extends object> = identity<{
        [k in keyof T]: T[k];
    }>;
    type noUndefined<T> = T extends undefined ? never : T;
    const isInteger: NumberConstructor["isInteger"];
}

declare const ZodIssueCode: {
    invalid_type: "invalid_type";
    custom: "custom";
    invalid_union: "invalid_union";
    invalid_union_discriminator: "invalid_union_discriminator";
    invalid_enum_value: "invalid_enum_value";
    unrecognized_keys: "unrecognized_keys";
    invalid_arguments: "invalid_arguments";
    invalid_return_type: "invalid_return_type";
    invalid_date: "invalid_date";
    invalid_string: "invalid_string";
    too_small: "too_small";
    too_big: "too_big";
    invalid_intersection_types: "invalid_intersection_types";
    not_multiple_of: "not_multiple_of";
};
declare type ZodIssueCode = keyof typeof ZodIssueCode;
declare type ZodIssueBase = {
    path: (string | number)[];
    message?: string;
};
interface ZodInvalidTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_type;
    expected: ZodParsedType;
    received: ZodParsedType;
}
interface ZodUnrecognizedKeysIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.unrecognized_keys;
    keys: string[];
}
interface ZodInvalidUnionIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union;
    unionErrors: ZodError[];
}
interface ZodInvalidUnionDiscriminatorIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union_discriminator;
    options: Primitive[];
}
interface ZodInvalidEnumValueIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_enum_value;
    options: (string | number)[];
}
interface ZodInvalidArgumentsIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_arguments;
    argumentsError: ZodError;
}
interface ZodInvalidReturnTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_return_type;
    returnTypeError: ZodError;
}
interface ZodInvalidDateIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_date;
}
declare type StringValidation = "email" | "url" | "uuid" | "regex" | "cuid";
interface ZodInvalidStringIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_string;
    validation: StringValidation;
}
interface ZodTooSmallIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_small;
    minimum: number;
    inclusive: boolean;
    type: "array" | "string" | "number" | "set";
}
interface ZodTooBigIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_big;
    maximum: number;
    inclusive: boolean;
    type: "array" | "string" | "number" | "set";
}
interface ZodInvalidIntersectionTypesIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_intersection_types;
}
interface ZodNotMultipleOfIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_multiple_of;
    multipleOf: number;
}
interface ZodCustomIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.custom;
    params?: {
        [k: string]: any;
    };
}
declare type DenormalizedError = {
    [k: string]: DenormalizedError | string[];
};
declare type ZodIssueOptionalMessage = ZodInvalidTypeIssue | ZodUnrecognizedKeysIssue | ZodInvalidUnionIssue | ZodInvalidUnionDiscriminatorIssue | ZodInvalidEnumValueIssue | ZodInvalidArgumentsIssue | ZodInvalidReturnTypeIssue | ZodInvalidDateIssue | ZodInvalidStringIssue | ZodTooSmallIssue | ZodTooBigIssue | ZodInvalidIntersectionTypesIssue | ZodNotMultipleOfIssue | ZodCustomIssue;
declare type ZodIssue = ZodIssueOptionalMessage & {
    message: string;
};
declare const quotelessJson: (obj: any) => string;
declare type ZodFormattedError<T> = {
    _errors: string[];
} & (T extends [any, ...any[]] ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : T extends any[] ? ZodFormattedError<T[number]>[] : T extends object ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : unknown);
declare class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    get errors(): ZodIssue[];
    constructor(issues: ZodIssue[]);
    format: () => ZodFormattedError<T>;
    static create: (issues: ZodIssue[]) => ZodError<any>;
    toString(): string;
    get message(): string;
    get isEmpty(): boolean;
    addIssue: (sub: ZodIssue) => void;
    addIssues: (subs?: ZodIssue[]) => void;
    flatten(mapper?: (issue: ZodIssue) => string): {
        formErrors: string[];
        fieldErrors: {
            [k: string]: string[];
        };
    };
    flatten<U>(mapper?: (issue: ZodIssue) => U): {
        formErrors: U[];
        fieldErrors: {
            [k: string]: U[];
        };
    };
    get formErrors(): {
        formErrors: string[];
        fieldErrors: {
            [k: string]: string[];
        };
    };
}
declare type stripPath<T extends object> = T extends any ? util.OmitKeys<T, "path"> : never;
declare type IssueData = stripPath<ZodIssueOptionalMessage> & {
    path?: (string | number)[];
    fatal?: boolean;
};
declare type MakeErrorData = IssueData;
declare type ErrorMapCtx = {
    defaultError: string;
    data: any;
};
declare type ZodErrorMap = typeof defaultErrorMap;
declare const defaultErrorMap: (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};
declare let overrideErrorMap: (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};
declare const setErrorMap: (map: ZodErrorMap) => void;

declare const ZodParsedType: {
    function: "function";
    number: "number";
    string: "string";
    nan: "nan";
    integer: "integer";
    float: "float";
    boolean: "boolean";
    date: "date";
    bigint: "bigint";
    symbol: "symbol";
    undefined: "undefined";
    null: "null";
    array: "array";
    object: "object";
    unknown: "unknown";
    promise: "promise";
    void: "void";
    never: "never";
    map: "map";
    set: "set";
};
declare type ZodParsedType = keyof typeof ZodParsedType;
declare const getParsedType: (data: any) => ZodParsedType;
declare const makeIssue: (params: {
    data: any;
    path: (string | number)[];
    errorMaps: ZodErrorMap[];
    issueData: IssueData;
}) => ZodIssue;
declare type ParseParams = {
    path: (string | number)[];
    errorMap: ZodErrorMap;
    async: boolean;
};
declare type ParsePathComponent = string | number;
declare type ParsePath = ParsePathComponent[];
declare const EMPTY_PATH: ParsePath;
interface ParseContext {
    readonly common: {
        readonly issues: ZodIssue[];
        readonly contextualErrorMap?: ZodErrorMap;
        readonly async: boolean;
        readonly typeCache: Map<any, ZodParsedType> | undefined;
    };
    readonly path: ParsePath;
    readonly schemaErrorMap?: ZodErrorMap;
    readonly parent: ParseContext | null;
    readonly data: any;
    readonly parsedType: ZodParsedType;
}
declare type ParseInput = {
    data: any;
    path: (string | number)[];
    parent: ParseContext;
};
declare function addIssueToContext(ctx: ParseContext, issueData: IssueData): void;
declare type ObjectPair = {
    key: SyncParseReturnType<any>;
    value: SyncParseReturnType<any>;
};
declare class ParseStatus {
    value: "aborted" | "dirty" | "valid";
    dirty(): void;
    abort(): void;
    static mergeArray(status: ParseStatus, results: SyncParseReturnType<any>[]): SyncParseReturnType;
    static mergeObjectAsync(status: ParseStatus, pairs: {
        key: ParseReturnType<any>;
        value: ParseReturnType<any>;
    }[]): Promise<SyncParseReturnType<any>>;
    static mergeObjectSync(status: ParseStatus, pairs: {
        key: SyncParseReturnType<any>;
        value: SyncParseReturnType<any>;
        alwaysSet?: boolean;
    }[]): SyncParseReturnType;
}
interface ParseResult {
    status: "aborted" | "dirty" | "valid";
    data: any;
}
declare type INVALID = {
    status: "aborted";
};
declare const INVALID: INVALID;
declare type DIRTY<T> = {
    status: "dirty";
    value: T;
};
declare const DIRTY: <T>(value: T) => DIRTY<T>;
declare type OK<T> = {
    status: "valid";
    value: T;
};
declare const OK: <T>(value: T) => OK<T>;
declare type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID;
declare type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>;
declare type ParseReturnType<T> = SyncParseReturnType<T> | AsyncParseReturnType<T>;
declare const isAborted: (x: ParseReturnType<any>) => x is INVALID;
declare const isDirty: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isValid: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isAsync: <T>(x: ParseReturnType<T>) => x is AsyncParseReturnType<T>;

declare namespace errorUtil {
    type ErrMessage = string | {
        message?: string;
    };
    const errToObj: (message?: ErrMessage | undefined) => {
        message?: string | undefined;
    };
    const toString: (message?: ErrMessage | undefined) => string | undefined;
}

declare namespace partialUtil {
    type DeepPartial<T extends ZodTypeAny> = T extends ZodObject<infer Shape, infer Params, infer Catchall> ? ZodObject<{
        [k in keyof Shape]: ZodOptional<DeepPartial<Shape[k]>>;
    }, Params, Catchall> : T extends ZodArray<infer Type, infer Card> ? ZodArray<DeepPartial<Type>, Card> : T extends ZodOptional<infer Type> ? ZodOptional<DeepPartial<Type>> : T extends ZodNullable<infer Type> ? ZodNullable<DeepPartial<Type>> : T extends ZodTuple<infer Items> ? {
        [k in keyof Items]: Items[k] extends ZodTypeAny ? DeepPartial<Items[k]> : never;
    } extends infer PI ? PI extends ZodTupleItems ? ZodTuple<PI> : never : never : T;
}

declare type RefinementCtx = {
    addIssue: (arg: IssueData) => void;
    path: (string | number)[];
};
declare type ZodRawShape = {
    [k: string]: ZodTypeAny;
};
declare type ZodTypeAny = ZodType<any, any, any>;
declare type TypeOf<T extends ZodType<any, any, any>> = T["_output"];
declare type input<T extends ZodType<any, any, any>> = T["_input"];
declare type output<T extends ZodType<any, any, any>> = T["_output"];
declare type allKeys<T> = T extends any ? keyof T : never;
declare type TypeOfFlattenedError<T extends ZodType<any, any, any>, U = string> = {
    formErrors: U[];
    fieldErrors: {
        [P in allKeys<TypeOf<T>>]?: U[];
    };
};
declare type TypeOfFormErrors<T extends ZodType<any, any, any>> = TypeOfFlattenedError<T>;

declare type CustomErrorParams = Partial<util.Omit<ZodCustomIssue, "code">>;
interface ZodTypeDef {
    errorMap?: ZodErrorMap;
    description?: string;
}
declare type RawCreateParams = {
    errorMap?: ZodErrorMap;
    invalid_type_error?: string;
    required_error?: string;
    description?: string;
} | undefined;
declare type SafeParseSuccess<Output> = {
    success: true;
    data: Output;
};
declare type SafeParseError<Input> = {
    success: false;
    error: ZodError<Input>;
};
declare type SafeParseReturnType<Input, Output> = SafeParseSuccess<Output> | SafeParseError<Input>;
declare abstract class ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _type: Output;
    readonly _output: Output;
    readonly _input: Input;
    readonly _def: Def;
    get description(): string | undefined;
    abstract _parse(input: ParseInput): ParseReturnType<Output>;
    _getType(input: ParseInput): string;
    _getOrReturnCtx(input: ParseInput, ctx?: ParseContext | undefined): ParseContext;
    _processInputParams(input: ParseInput): {
        status: ParseStatus;
        ctx: ParseContext;
    };
    _parseSync(input: ParseInput): SyncParseReturnType<Output>;
    _parseAsync(input: ParseInput): AsyncParseReturnType<Output>;
    parse(data: unknown, params?: Partial<ParseParams>): Output;
    safeParse(data: unknown, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output>;
    parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output>;
    safeParseAsync(data: unknown, params?: Partial<ParseParams>): Promise<SafeParseReturnType<Input, Output>>;
    /** Alias of safeParseAsync */
    spa: (data: unknown, params?: Partial<ParseParams> | undefined) => Promise<SafeParseReturnType<Input, Output>>;
    refine<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, RefinedOutput, RefinedOutput>;
    refine(check: (arg: Output) => unknown | Promise<unknown>, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, Output, Input>;
    refinement<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, RefinedOutput, RefinedOutput>;
    refinement(check: (arg: Output) => boolean, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, Output, Input>;
    _refinement(refinement: RefinementEffect<Output>["refinement"]): ZodEffects<this, Output, Input>;
    superRefine: (refinement: RefinementEffect<Output>["refinement"]) => ZodEffects<this, Output, Input>;
    constructor(def: Def);
    optional(): ZodOptional<this>;
    nullable(): ZodNullable<this>;
    nullish(): ZodNullable<ZodOptional<this>>;
    array(): ZodArray<this>;
    promise(): ZodPromise<this>;
    or<T extends ZodTypeAny>(option: T): ZodUnion<[this, T]>;
    and<T extends ZodTypeAny>(incoming: T): ZodIntersection<this, T>;
    transform<NewOut>(transform: (arg: Output) => NewOut | Promise<NewOut>): ZodEffects<this, NewOut>;
    default(def: util.noUndefined<Input>): ZodDefault<this>;
    default(def: () => util.noUndefined<Input>): ZodDefault<this>;
    describe(description: string): this;
    isOptional(): boolean;
    isNullable(): boolean;
}
declare type ZodStringCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
} | {
    kind: "email";
    message?: string;
} | {
    kind: "url";
    message?: string;
} | {
    kind: "uuid";
    message?: string;
} | {
    kind: "cuid";
    message?: string;
} | {
    kind: "regex";
    regex: RegExp;
    message?: string;
};
interface ZodStringDef extends ZodTypeDef {
    checks: ZodStringCheck[];
    typeName: ZodFirstPartyTypeKind.ZodString;
}
declare class ZodString extends ZodType<string, ZodStringDef> {
    _parse(input: ParseInput): ParseReturnType<string>;
    protected _regex: (regex: RegExp, validation: StringValidation, message?: errorUtil.ErrMessage | undefined) => ZodEffects<this, string, string>;
    _addCheck(check: ZodStringCheck): ZodString;
    email(message?: errorUtil.ErrMessage): ZodString;
    url(message?: errorUtil.ErrMessage): ZodString;
    uuid(message?: errorUtil.ErrMessage): ZodString;
    cuid(message?: errorUtil.ErrMessage): ZodString;
    regex(regex: RegExp, message?: errorUtil.ErrMessage): ZodString;
    min(minLength: number, message?: errorUtil.ErrMessage): ZodString;
    max(maxLength: number, message?: errorUtil.ErrMessage): ZodString;
    length(len: number, message?: errorUtil.ErrMessage): ZodString;
    /**
     * Deprecated.
     * Use z.string().min(1) instead.
     */
    nonempty: (message?: errorUtil.ErrMessage | undefined) => ZodString;
    get isEmail(): boolean;
    get isURL(): boolean;
    get isUUID(): boolean;
    get isCUID(): boolean;
    get minLength(): number;
    get maxLength(): null;
    static create: (params?: RawCreateParams) => ZodString;
}
declare type ZodNumberCheck = {
    kind: "min";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "max";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "int";
    message?: string;
} | {
    kind: "multipleOf";
    value: number;
    message?: string;
};
interface ZodNumberDef extends ZodTypeDef {
    checks: ZodNumberCheck[];
    typeName: ZodFirstPartyTypeKind.ZodNumber;
}
declare class ZodNumber extends ZodType<number, ZodNumberDef> {
    _parse(input: ParseInput): ParseReturnType<number>;
    static create: (params?: RawCreateParams) => ZodNumber;
    gte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    min: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    gt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    lte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    max: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    lt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    protected setLimit(kind: "min" | "max", value: number, inclusive: boolean, message?: string): ZodNumber;
    _addCheck(check: ZodNumberCheck): ZodNumber;
    int(message?: errorUtil.ErrMessage): ZodNumber;
    positive(message?: errorUtil.ErrMessage): ZodNumber;
    negative(message?: errorUtil.ErrMessage): ZodNumber;
    nonpositive(message?: errorUtil.ErrMessage): ZodNumber;
    nonnegative(message?: errorUtil.ErrMessage): ZodNumber;
    multipleOf(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    step: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    get minValue(): number | null;
    get maxValue(): number | null;
    get isInt(): boolean;
}
interface ZodBigIntDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodBigInt;
}
declare class ZodBigInt extends ZodType<bigint, ZodBigIntDef> {
    _parse(input: ParseInput): ParseReturnType<bigint>;
    static create: (params?: RawCreateParams) => ZodBigInt;
}
interface ZodBooleanDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodBoolean;
}
declare class ZodBoolean extends ZodType<boolean, ZodBooleanDef> {
    _parse(input: ParseInput): ParseReturnType<boolean>;
    static create: (params?: RawCreateParams) => ZodBoolean;
}
interface ZodDateDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodDate;
}
declare class ZodDate extends ZodType<Date, ZodDateDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodDate;
}
interface ZodUndefinedDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUndefined;
}
declare class ZodUndefined extends ZodType<undefined, ZodUndefinedDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    params?: RawCreateParams;
    static create: (params?: RawCreateParams) => ZodUndefined;
}
interface ZodNullDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNull;
}
declare class ZodNull extends ZodType<null, ZodNullDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNull;
}
interface ZodAnyDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodAny;
}
declare class ZodAny extends ZodType<any, ZodAnyDef> {
    _any: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodAny;
}
interface ZodUnknownDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUnknown;
}
declare class ZodUnknown extends ZodType<unknown, ZodUnknownDef> {
    _unknown: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodUnknown;
}
interface ZodNeverDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNever;
}
declare class ZodNever extends ZodType<never, ZodNeverDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNever;
}
interface ZodVoidDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodVoid;
}
declare class ZodVoid extends ZodType<void, ZodVoidDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodVoid;
}
interface ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodArray;
    minLength: {
        value: number;
        message?: string;
    } | null;
    maxLength: {
        value: number;
        message?: string;
    } | null;
}
declare type ArrayCardinality = "many" | "atleastone";
declare type arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = Cardinality extends "atleastone" ? [T["_output"], ...T["_output"][]] : T["_output"][];
declare class ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> extends ZodType<arrayOutputType<T, Cardinality>, ZodArrayDef<T>, Cardinality extends "atleastone" ? [T["_input"], ...T["_input"][]] : T["_input"][]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): T;
    min(minLength: number, message?: errorUtil.ErrMessage): this;
    max(maxLength: number, message?: errorUtil.ErrMessage): this;
    length(len: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodArray<T, "atleastone">;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodArray<T_1, "many">;
}
declare type ZodNonEmptyArray<T extends ZodTypeAny> = ZodArray<T, "atleastone">;
declare namespace objectUtil {
    export type MergeShapes<U extends ZodRawShape, V extends ZodRawShape> = {
        [k in Exclude<keyof U, keyof V>]: U[k];
    } & V;
    type optionalKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? k : never;
    }[keyof T];
    type requiredKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? never : k;
    }[keyof T];
    export type addQuestionMarks<T extends object> = {
        [k in optionalKeys<T>]?: T[k];
    } & {
        [k in requiredKeys<T>]: T[k];
    };
    export type identity<T> = T;
    export type flatten<T extends object> = identity<{
        [k in keyof T]: T[k];
    }>;
    export type noNeverKeys<T extends ZodRawShape> = {
        [k in keyof T]: [T[k]] extends [never] ? never : k;
    }[keyof T];
    export type noNever<T extends ZodRawShape> = identity<{
        [k in noNeverKeys<T>]: k extends keyof T ? T[k] : never;
    }>;
    export const mergeShapes: <U extends ZodRawShape, T extends ZodRawShape>(first: U, second: T) => T & U;
    export {};
}
declare type extendShape<A, B> = {
    [k in Exclude<keyof A, keyof B>]: A[k];
} & {
    [k in keyof B]: B[k];
};
declare type UnknownKeysParam = "passthrough" | "strict" | "strip";
interface ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodObject;
    shape: () => T;
    catchall: Catchall;
    unknownKeys: UnknownKeys;
}
declare type baseObjectOutputType<Shape extends ZodRawShape> = objectUtil.flatten<objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_output"];
}>>;
declare type objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? baseObjectOutputType<Shape> : objectUtil.flatten<baseObjectOutputType<Shape> & {
    [k: string]: Catchall["_output"];
}>;
declare type baseObjectInputType<Shape extends ZodRawShape> = objectUtil.flatten<objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_input"];
}>>;
declare type objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? baseObjectInputType<Shape> : objectUtil.flatten<baseObjectInputType<Shape> & {
    [k: string]: Catchall["_input"];
}>;
declare type deoptional<T extends ZodTypeAny> = T extends ZodOptional<infer U> ? deoptional<U> : T;
declare type SomeZodObject = ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, any, any>;
declare class ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = "strip", Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall>, Input = objectInputType<T, Catchall>> extends ZodType<Output, ZodObjectDef<T, UnknownKeys, Catchall>, Input> {
    readonly _shape: T;
    readonly _unknownKeys: UnknownKeys;
    readonly _catchall: Catchall;
    private _cached;
    _getCached(): {
        shape: T;
        keys: string[];
    };
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get shape(): T;
    strict(message?: errorUtil.ErrMessage): ZodObject<T, "strict", Catchall>;
    strip(): ZodObject<T, "strip", Catchall>;
    passthrough(): ZodObject<T, "passthrough", Catchall>;
    /**
     * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
     * If you want to pass through unknown properties, use `.passthrough()` instead.
     */
    nonstrict: () => ZodObject<T, "passthrough", Catchall>;
    augment: <Augmentation extends ZodRawShape>(augmentation: Augmentation) => ZodObject<extendShape<T, Augmentation>, UnknownKeys, Catchall, objectOutputType<extendShape<T, Augmentation>, Catchall>, objectInputType<extendShape<T, Augmentation>, Catchall>>;
    extend: <Augmentation extends ZodRawShape>(augmentation: Augmentation) => ZodObject<extendShape<T, Augmentation>, UnknownKeys, Catchall, objectOutputType<extendShape<T, Augmentation>, Catchall>, objectInputType<extendShape<T, Augmentation>, Catchall>>;
    setKey<Key extends string, Schema extends ZodTypeAny>(key: Key, schema: Schema): ZodObject<T & {
        [k in Key]: Schema;
    }, UnknownKeys, Catchall>;
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge<Incoming extends AnyZodObject>(merging: Incoming): ZodObject<extendShape<T, Incoming["_shape"]>, UnknownKeys, Catchall>;
    catchall<Index extends ZodTypeAny>(index: Index): ZodObject<T, UnknownKeys, Index>;
    pick<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<objectUtil.noNever<{
        [k in keyof Mask]: k extends keyof T ? T[k] : never;
    }>, UnknownKeys, Catchall>;
    omit<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? never : T[k];
    }>, UnknownKeys, Catchall>;
    deepPartial(): partialUtil.DeepPartial<this>;
    partial(): ZodObject<{
        [k in keyof T]: ZodOptional<T[k]>;
    }, UnknownKeys, Catchall>;
    partial<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? ZodOptional<T[k]> : T[k];
    }>, UnknownKeys, Catchall>;
    required(): ZodObject<{
        [k in keyof T]: deoptional<T[k]>;
    }, UnknownKeys, Catchall>;
    static create: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>[k_3]; }>;
    static strictCreate: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strict", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>[k_3]; }>;
    static lazycreate: <T_1 extends ZodRawShape>(shape: () => T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T_1]: T_1[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T_1]: T_1[k_2]["_input"]; }>[k_3]; }>;
}
declare type AnyZodObject = ZodObject<any, any, any>;
declare type ZodUnionOptions = Readonly<[ZodTypeAny, ...ZodTypeAny[]]>;
interface ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> extends ZodTypeDef {
    options: T;
    typeName: ZodFirstPartyTypeKind.ZodUnion;
}
declare class ZodUnion<T extends ZodUnionOptions> extends ZodType<T[number]["_output"], ZodUnionDef<T>, T[number]["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    static create: <T_1 extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T_1, params?: RawCreateParams) => ZodUnion<T_1>;
}
declare type ZodDiscriminatedUnionOption<Discriminator extends string, DiscriminatorValue extends Primitive> = ZodObject<{
    [key in Discriminator]: ZodLiteral<DiscriminatorValue>;
} & ZodRawShape, any, any>;
interface ZodDiscriminatedUnionDef<Discriminator extends string, DiscriminatorValue extends Primitive, Option extends ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>> extends ZodTypeDef {
    discriminator: Discriminator;
    options: Map<DiscriminatorValue, Option>;
    typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
}
declare class ZodDiscriminatedUnion<Discriminator extends string, DiscriminatorValue extends Primitive, Option extends ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>> extends ZodType<Option["_output"], ZodDiscriminatedUnionDef<Discriminator, DiscriminatorValue, Option>, Option["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get discriminator(): Discriminator;
    get validDiscriminatorValues(): DiscriminatorValue[];
    get options(): Map<DiscriminatorValue, Option>;
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create<Discriminator extends string, DiscriminatorValue extends Primitive, Types extends [
        ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>,
        ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>,
        ...ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>[]
    ]>(discriminator: Discriminator, types: Types, params?: RawCreateParams): ZodDiscriminatedUnion<Discriminator, DiscriminatorValue, Types[number]>;
}
interface ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    left: T;
    right: U;
    typeName: ZodFirstPartyTypeKind.ZodIntersection;
}
declare class ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> extends ZodType<T["_output"] & U["_output"], ZodIntersectionDef<T, U>, T["_input"] & U["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny, U_1 extends ZodTypeAny>(left: T_1, right: U_1, params?: RawCreateParams) => ZodIntersection<T_1, U_1>;
}
declare type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
declare type AssertArray<T> = T extends any[] ? T : never;
declare type OutputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_output"] : never;
}>;
declare type OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...OutputTypeOfTuple<T>, ...Rest["_output"][]] : OutputTypeOfTuple<T>;
declare type InputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_input"] : never;
}>;
declare type InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...InputTypeOfTuple<T>, ...Rest["_input"][]] : InputTypeOfTuple<T>;
interface ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> extends ZodTypeDef {
    items: T;
    rest: Rest;
    typeName: ZodFirstPartyTypeKind.ZodTuple;
}
declare class ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> extends ZodType<OutputTypeOfTupleWithRest<T, Rest>, ZodTupleDef<T, Rest>, InputTypeOfTupleWithRest<T, Rest>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get items(): T;
    rest<Rest extends ZodTypeAny>(rest: Rest): ZodTuple<T, Rest>;
    static create: <T_1 extends [ZodTypeAny, ...ZodTypeAny[]] | []>(schemas: T_1, params?: RawCreateParams) => ZodTuple<T_1, null>;
}
interface ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodRecord;
}
declare type KeySchema = ZodType<string | number | symbol, any, any>;
declare type RecordType<K extends string | number | symbol, V> = [string] extends [K] ? Record<K, V> : [number] extends [K] ? Record<K, V> : [symbol] extends [K] ? Record<K, V> : Partial<Record<K, V>>;
declare class ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<RecordType<Key["_output"], Value["_output"]>, ZodRecordDef<Key, Value>, RecordType<Key["_input"], Value["_input"]>> {
    get keySchema(): Key;
    get valueSchema(): Value;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): Value;
    static create<Value extends ZodTypeAny>(valueType: Value, params?: RawCreateParams): ZodRecord<ZodString, Value>;
    static create<Keys extends KeySchema, Value extends ZodTypeAny>(keySchema: Keys, valueType: Value, params?: RawCreateParams): ZodRecord<Keys, Value>;
}
interface ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodMap;
}
declare class ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Map<Key["_output"], Value["_output"]>, ZodMapDef<Key, Value>, Map<Key["_input"], Value["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <Key_1 extends ZodTypeAny = ZodTypeAny, Value_1 extends ZodTypeAny = ZodTypeAny>(keyType: Key_1, valueType: Value_1, params?: RawCreateParams) => ZodMap<Key_1, Value_1>;
}
interface ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    typeName: ZodFirstPartyTypeKind.ZodSet;
    minSize: {
        value: number;
        message?: string;
    } | null;
    maxSize: {
        value: number;
        message?: string;
    } | null;
}
declare class ZodSet<Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Set<Value["_output"]>, ZodSetDef<Value>, Set<Value["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    min(minSize: number, message?: errorUtil.ErrMessage): this;
    max(maxSize: number, message?: errorUtil.ErrMessage): this;
    size(size: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodSet<Value>;
    static create: <Value_1 extends ZodTypeAny = ZodTypeAny>(valueType: Value_1, params?: RawCreateParams) => ZodSet<Value_1>;
}
interface ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    args: Args;
    returns: Returns;
    typeName: ZodFirstPartyTypeKind.ZodFunction;
}
declare type OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_input"] extends Array<any> ? (...args: Args["_input"]) => Returns["_output"] : never;
declare type InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_output"] extends Array<any> ? (...args: Args["_output"]) => Returns["_input"] : never;
declare class ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> extends ZodType<OuterTypeOfFunction<Args, Returns>, ZodFunctionDef<Args, Returns>, InnerTypeOfFunction<Args, Returns>> {
    _parse(input: ParseInput): ParseReturnType<any>;
    parameters(): Args;
    returnType(): Returns;
    args<Items extends Parameters<typeof ZodTuple["create"]>[0]>(...items: Items): ZodFunction<ZodTuple<Items, ZodUnknown>, Returns>;
    returns<NewReturnType extends ZodType<any, any>>(returnType: NewReturnType): ZodFunction<Args, NewReturnType>;
    implement<F extends InnerTypeOfFunction<Args, Returns>>(func: F): F;
    strictImplement(func: InnerTypeOfFunction<Args, Returns>): InnerTypeOfFunction<Args, Returns>;
    validate: <F extends InnerTypeOfFunction<Args, Returns>>(func: F) => F;
    static create: <T extends ZodTuple<any, any> = ZodTuple<[], ZodUnknown>, U extends ZodTypeAny = ZodUnknown>(args?: T | undefined, returns?: U | undefined, params?: RawCreateParams) => ZodFunction<T, U>;
}
interface ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    getter: () => T;
    typeName: ZodFirstPartyTypeKind.ZodLazy;
}
declare class ZodLazy<T extends ZodTypeAny> extends ZodType<output<T>, ZodLazyDef<T>, input<T>> {
    get schema(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(getter: () => T_1, params?: RawCreateParams) => ZodLazy<T_1>;
}
interface ZodLiteralDef<T = any> extends ZodTypeDef {
    value: T;
    typeName: ZodFirstPartyTypeKind.ZodLiteral;
}
declare class ZodLiteral<T> extends ZodType<T, ZodLiteralDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get value(): T;
    static create: <T_1 extends Primitive>(value: T_1, params?: RawCreateParams) => ZodLiteral<T_1>;
}
declare type ArrayKeys = keyof any[];
declare type Indices<T> = Exclude<keyof T, ArrayKeys>;
declare type EnumValues = [string, ...string[]];
declare type Values<T extends EnumValues> = {
    [k in T[number]]: k;
};
interface ZodEnumDef<T extends EnumValues = EnumValues> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodEnum;
}
declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
declare function createZodEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T): ZodEnum<Writeable<T>>;
declare function createZodEnum<U extends string, T extends [U, ...U[]]>(values: T): ZodEnum<T>;
declare class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number], ZodEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    get enum(): Values<T>;
    get Values(): Values<T>;
    get Enum(): Values<T>;
    static create: typeof createZodEnum;
}
interface ZodNativeEnumDef<T extends EnumLike = EnumLike> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum;
}
declare type EnumLike = {
    [k: string]: string | number;
    [nu: number]: string;
};
declare class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNativeEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<T[keyof T]>;
    get enum(): T;
    static create: <T_1 extends EnumLike>(values: T_1, params?: RawCreateParams) => ZodNativeEnum<T_1>;
}
interface ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodPromise;
}
declare class ZodPromise<T extends ZodTypeAny> extends ZodType<Promise<T["_output"]>, ZodPromiseDef<T>, Promise<T["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodPromise<T_1>;
}
declare type Refinement<T> = (arg: T, ctx: RefinementCtx) => any;
declare type SuperRefinement<T> = (arg: T, ctx: RefinementCtx) => void;
declare type RefinementEffect<T> = {
    type: "refinement";
    refinement: (arg: T, ctx: RefinementCtx) => any;
};
declare type TransformEffect<T> = {
    type: "transform";
    transform: (arg: T) => any;
};
declare type PreprocessEffect<T> = {
    type: "preprocess";
    transform: (arg: T) => any;
};
declare type Effect<T> = RefinementEffect<T> | TransformEffect<T> | PreprocessEffect<T>;
interface ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    schema: T;
    typeName: ZodFirstPartyTypeKind.ZodEffects;
    effect: Effect<any>;
}
declare class ZodEffects<T extends ZodTypeAny, Output = T["_output"], Input = T["_input"]> extends ZodType<Output, ZodEffectsDef<T>, Input> {
    innerType(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], I["_input"]>;
    static createWithPreprocess: <I extends ZodTypeAny>(preprocess: (arg: unknown) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], I["_input"]>;
}

interface ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodOptional;
}
declare type ZodOptionalType<T extends ZodTypeAny> = ZodOptional<T>;
declare class ZodOptional<T extends ZodTypeAny> extends ZodType<T["_output"] | undefined, ZodOptionalDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodOptional<T_1>;
}
interface ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodNullable;
}
declare type ZodNullableType<T extends ZodTypeAny> = ZodNullable<T>;
declare class ZodNullable<T extends ZodTypeAny> extends ZodType<T["_output"] | null, ZodNullableDef<T>, T["_input"] | null> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodNullable<T_1>;
}
interface ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    defaultValue: () => util.noUndefined<T["_input"]>;
    typeName: ZodFirstPartyTypeKind.ZodDefault;
}
declare class ZodDefault<T extends ZodTypeAny> extends ZodType<util.noUndefined<T["_output"]>, ZodDefaultDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeDefault(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodOptional<T_1>;
}
interface ZodNaNDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNaN;
}
declare class ZodNaN extends ZodType<number, ZodNaNDef> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create: (params?: RawCreateParams) => ZodNaN;
}
declare const custom: <T>(check?: ((data: unknown) => any) | undefined, params?: Parameters<ZodTypeAny["refine"]>[1]) => ZodType<T, ZodTypeDef, T>;

declare const late: {
    object: <T extends ZodRawShape>(shape: () => T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }>;
};
declare enum ZodFirstPartyTypeKind {
    ZodString = "ZodString",
    ZodNumber = "ZodNumber",
    ZodNaN = "ZodNaN",
    ZodBigInt = "ZodBigInt",
    ZodBoolean = "ZodBoolean",
    ZodDate = "ZodDate",
    ZodUndefined = "ZodUndefined",
    ZodNull = "ZodNull",
    ZodAny = "ZodAny",
    ZodUnknown = "ZodUnknown",
    ZodNever = "ZodNever",
    ZodVoid = "ZodVoid",
    ZodArray = "ZodArray",
    ZodObject = "ZodObject",
    ZodUnion = "ZodUnion",
    ZodDiscriminatedUnion = "ZodDiscriminatedUnion",
    ZodIntersection = "ZodIntersection",
    ZodTuple = "ZodTuple",
    ZodRecord = "ZodRecord",
    ZodMap = "ZodMap",
    ZodSet = "ZodSet",
    ZodFunction = "ZodFunction",
    ZodLazy = "ZodLazy",
    ZodLiteral = "ZodLiteral",
    ZodEnum = "ZodEnum",
    ZodEffects = "ZodEffects",
    ZodNativeEnum = "ZodNativeEnum",
    ZodOptional = "ZodOptional",
    ZodNullable = "ZodNullable",
    ZodDefault = "ZodDefault",
    ZodPromise = "ZodPromise"
}
declare type ZodFirstPartySchemaTypes = ZodString | ZodNumber | ZodNaN | ZodBigInt | ZodBoolean | ZodDate | ZodUndefined | ZodNull | ZodAny | ZodUnknown | ZodNever | ZodVoid | ZodArray<any, any> | ZodObject<any, any, any, any, any> | ZodUnion<any> | ZodDiscriminatedUnion<any, any, any> | ZodIntersection<any, any> | ZodTuple<any, any> | ZodRecord<any, any> | ZodMap<any> | ZodSet<any> | ZodFunction<any, any> | ZodLazy<any> | ZodLiteral<any> | ZodEnum<any> | ZodEffects<any, any, any> | ZodNativeEnum<any> | ZodOptional<any> | ZodNullable<any> | ZodDefault<any> | ZodPromise<any>;
declare const instanceOfType: <T extends new (...args: any[]) => any>(cls: T, params?: Parameters<ZodTypeAny["refine"]>[1]) => ZodType<InstanceType<T>, ZodTypeDef, InstanceType<T>>;
declare const stringType: (params?: RawCreateParams) => ZodString;
declare const numberType: (params?: RawCreateParams) => ZodNumber;
declare const nanType: (params?: RawCreateParams) => ZodNaN;
declare const bigIntType: (params?: RawCreateParams) => ZodBigInt;
declare const booleanType: (params?: RawCreateParams) => ZodBoolean;
declare const dateType: (params?: RawCreateParams) => ZodDate;
declare const undefinedType: (params?: RawCreateParams) => ZodUndefined;
declare const nullType: (params?: RawCreateParams) => ZodNull;
declare const anyType: (params?: RawCreateParams) => ZodAny;
declare const unknownType: (params?: RawCreateParams) => ZodUnknown;
declare const neverType: (params?: RawCreateParams) => ZodNever;
declare const voidType: (params?: RawCreateParams) => ZodVoid;
declare const arrayType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodArray<T, "many">;
declare const objectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }>;
declare const strictObjectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strict", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }>;
declare const unionType: <T extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T, params?: RawCreateParams) => ZodUnion<T>;
declare const discriminatedUnionType: typeof ZodDiscriminatedUnion.create;
declare const intersectionType: <T extends ZodTypeAny, U extends ZodTypeAny>(left: T, right: U, params?: RawCreateParams) => ZodIntersection<T, U>;
declare const tupleType: <T extends [ZodTypeAny, ...ZodTypeAny[]] | []>(schemas: T, params?: RawCreateParams) => ZodTuple<T, null>;
declare const recordType: typeof ZodRecord.create;
declare const mapType: <Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny>(keyType: Key, valueType: Value, params?: RawCreateParams) => ZodMap<Key, Value>;
declare const setType: <Value extends ZodTypeAny = ZodTypeAny>(valueType: Value, params?: RawCreateParams) => ZodSet<Value>;
declare const functionType: <T extends ZodTuple<any, any> = ZodTuple<[], ZodUnknown>, U extends ZodTypeAny = ZodUnknown>(args?: T | undefined, returns?: U | undefined, params?: RawCreateParams) => ZodFunction<T, U>;
declare const lazyType: <T extends ZodTypeAny>(getter: () => T, params?: RawCreateParams) => ZodLazy<T>;
declare const literalType: <T extends Primitive>(value: T, params?: RawCreateParams) => ZodLiteral<T>;
declare const enumType: typeof createZodEnum;
declare const nativeEnumType: <T extends EnumLike>(values: T, params?: RawCreateParams) => ZodNativeEnum<T>;
declare const promiseType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodPromise<T>;
declare const effectsType: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], I["_input"]>;
declare const optionalType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodOptional<T>;
declare const nullableType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodNullable<T>;
declare const preprocessType: <I extends ZodTypeAny>(preprocess: (arg: unknown) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], I["_input"]>;
declare const ostring: () => ZodOptional<ZodString>;
declare const onumber: () => ZodOptional<ZodNumber>;
declare const oboolean: () => ZodOptional<ZodBoolean>;

type mod_ZodParsedType = ZodParsedType;
declare const mod_getParsedType: typeof getParsedType;
declare const mod_makeIssue: typeof makeIssue;
type mod_ParseParams = ParseParams;
type mod_ParsePathComponent = ParsePathComponent;
type mod_ParsePath = ParsePath;
declare const mod_EMPTY_PATH: typeof EMPTY_PATH;
type mod_ParseContext = ParseContext;
type mod_ParseInput = ParseInput;
declare const mod_addIssueToContext: typeof addIssueToContext;
type mod_ObjectPair = ObjectPair;
type mod_ParseStatus = ParseStatus;
declare const mod_ParseStatus: typeof ParseStatus;
type mod_ParseResult = ParseResult;
declare const mod_INVALID: typeof INVALID;
declare const mod_DIRTY: typeof DIRTY;
declare const mod_OK: typeof OK;
type mod_SyncParseReturnType<T = any> = SyncParseReturnType<T>;
type mod_AsyncParseReturnType<T> = AsyncParseReturnType<T>;
type mod_ParseReturnType<T> = ParseReturnType<T>;
declare const mod_isAborted: typeof isAborted;
declare const mod_isDirty: typeof isDirty;
declare const mod_isValid: typeof isValid;
declare const mod_isAsync: typeof isAsync;
type mod_Primitive = Primitive;
type mod_Scalars = Scalars;
declare const mod_oboolean: typeof oboolean;
declare const mod_onumber: typeof onumber;
declare const mod_ostring: typeof ostring;
type mod_RefinementCtx = RefinementCtx;
type mod_ZodRawShape = ZodRawShape;
type mod_ZodTypeAny = ZodTypeAny;
type mod_TypeOf<T extends ZodType<any, any, any>> = TypeOf<T>;
type mod_input<T extends ZodType<any, any, any>> = input<T>;
type mod_output<T extends ZodType<any, any, any>> = output<T>;
type mod_TypeOfFlattenedError<T extends ZodType<any, any, any>, U = string> = TypeOfFlattenedError<T, U>;
type mod_TypeOfFormErrors<T extends ZodType<any, any, any>> = TypeOfFormErrors<T>;
type mod_CustomErrorParams = CustomErrorParams;
type mod_ZodTypeDef = ZodTypeDef;
type mod_SafeParseSuccess<Output> = SafeParseSuccess<Output>;
type mod_SafeParseError<Input> = SafeParseError<Input>;
type mod_SafeParseReturnType<Input, Output> = SafeParseReturnType<Input, Output>;
type mod_ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> = ZodType<Output, Def, Input>;
declare const mod_ZodType: typeof ZodType;
type mod_ZodStringDef = ZodStringDef;
type mod_ZodString = ZodString;
declare const mod_ZodString: typeof ZodString;
type mod_ZodNumberDef = ZodNumberDef;
type mod_ZodNumber = ZodNumber;
declare const mod_ZodNumber: typeof ZodNumber;
type mod_ZodBigIntDef = ZodBigIntDef;
type mod_ZodBigInt = ZodBigInt;
declare const mod_ZodBigInt: typeof ZodBigInt;
type mod_ZodBooleanDef = ZodBooleanDef;
type mod_ZodBoolean = ZodBoolean;
declare const mod_ZodBoolean: typeof ZodBoolean;
type mod_ZodDateDef = ZodDateDef;
type mod_ZodDate = ZodDate;
declare const mod_ZodDate: typeof ZodDate;
type mod_ZodUndefinedDef = ZodUndefinedDef;
type mod_ZodUndefined = ZodUndefined;
declare const mod_ZodUndefined: typeof ZodUndefined;
type mod_ZodNullDef = ZodNullDef;
type mod_ZodNull = ZodNull;
declare const mod_ZodNull: typeof ZodNull;
type mod_ZodAnyDef = ZodAnyDef;
type mod_ZodAny = ZodAny;
declare const mod_ZodAny: typeof ZodAny;
type mod_ZodUnknownDef = ZodUnknownDef;
type mod_ZodUnknown = ZodUnknown;
declare const mod_ZodUnknown: typeof ZodUnknown;
type mod_ZodNeverDef = ZodNeverDef;
type mod_ZodNever = ZodNever;
declare const mod_ZodNever: typeof ZodNever;
type mod_ZodVoidDef = ZodVoidDef;
type mod_ZodVoid = ZodVoid;
declare const mod_ZodVoid: typeof ZodVoid;
type mod_ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> = ZodArrayDef<T>;
type mod_ArrayCardinality = ArrayCardinality;
type mod_ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = ZodArray<T, Cardinality>;
declare const mod_ZodArray: typeof ZodArray;
type mod_ZodNonEmptyArray<T extends ZodTypeAny> = ZodNonEmptyArray<T>;
declare const mod_objectUtil: typeof objectUtil;
type mod_extendShape<A, B> = extendShape<A, B>;
type mod_ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> = ZodObjectDef<T, UnknownKeys, Catchall>;
type mod_baseObjectOutputType<Shape extends ZodRawShape> = baseObjectOutputType<Shape>;
type mod_objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = objectOutputType<Shape, Catchall>;
type mod_baseObjectInputType<Shape extends ZodRawShape> = baseObjectInputType<Shape>;
type mod_objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = objectInputType<Shape, Catchall>;
type mod_SomeZodObject = SomeZodObject;
type mod_ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = "strip", Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall>, Input = objectInputType<T, Catchall>> = ZodObject<T, UnknownKeys, Catchall, Output, Input>;
declare const mod_ZodObject: typeof ZodObject;
type mod_AnyZodObject = AnyZodObject;
type mod_ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> = ZodUnionDef<T>;
type mod_ZodUnion<T extends ZodUnionOptions> = ZodUnion<T>;
declare const mod_ZodUnion: typeof ZodUnion;
type mod_ZodDiscriminatedUnionOption<Discriminator extends string, DiscriminatorValue extends Primitive> = ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>;
type mod_ZodDiscriminatedUnionDef<Discriminator extends string, DiscriminatorValue extends Primitive, Option extends ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>> = ZodDiscriminatedUnionDef<Discriminator, DiscriminatorValue, Option>;
type mod_ZodDiscriminatedUnion<Discriminator extends string, DiscriminatorValue extends Primitive, Option extends ZodDiscriminatedUnionOption<Discriminator, DiscriminatorValue>> = ZodDiscriminatedUnion<Discriminator, DiscriminatorValue, Option>;
declare const mod_ZodDiscriminatedUnion: typeof ZodDiscriminatedUnion;
type mod_ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> = ZodIntersectionDef<T, U>;
type mod_ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> = ZodIntersection<T, U>;
declare const mod_ZodIntersection: typeof ZodIntersection;
type mod_ZodTupleItems = ZodTupleItems;
type mod_AssertArray<T> = AssertArray<T>;
type mod_OutputTypeOfTuple<T extends ZodTupleItems | []> = OutputTypeOfTuple<T>;
type mod_OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = OutputTypeOfTupleWithRest<T, Rest>;
type mod_InputTypeOfTuple<T extends ZodTupleItems | []> = InputTypeOfTuple<T>;
type mod_InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = InputTypeOfTupleWithRest<T, Rest>;
type mod_ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> = ZodTupleDef<T, Rest>;
type mod_ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> = ZodTuple<T, Rest>;
declare const mod_ZodTuple: typeof ZodTuple;
type mod_ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecordDef<Key, Value>;
type mod_ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecord<Key, Value>;
declare const mod_ZodRecord: typeof ZodRecord;
type mod_ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMapDef<Key, Value>;
type mod_ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMap<Key, Value>;
declare const mod_ZodMap: typeof ZodMap;
type mod_ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> = ZodSetDef<Value>;
type mod_ZodSet<Value extends ZodTypeAny = ZodTypeAny> = ZodSet<Value>;
declare const mod_ZodSet: typeof ZodSet;
type mod_ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> = ZodFunctionDef<Args, Returns>;
type mod_OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = OuterTypeOfFunction<Args, Returns>;
type mod_InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = InnerTypeOfFunction<Args, Returns>;
type mod_ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = ZodFunction<Args, Returns>;
declare const mod_ZodFunction: typeof ZodFunction;
type mod_ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> = ZodLazyDef<T>;
type mod_ZodLazy<T extends ZodTypeAny> = ZodLazy<T>;
declare const mod_ZodLazy: typeof ZodLazy;
type mod_ZodLiteralDef<T = any> = ZodLiteralDef<T>;
type mod_ZodLiteral<T> = ZodLiteral<T>;
declare const mod_ZodLiteral: typeof ZodLiteral;
type mod_ArrayKeys = ArrayKeys;
type mod_Indices<T> = Indices<T>;
type mod_ZodEnumDef<T extends EnumValues = EnumValues> = ZodEnumDef<T>;
type mod_ZodEnum<T extends [string, ...string[]]> = ZodEnum<T>;
declare const mod_ZodEnum: typeof ZodEnum;
type mod_ZodNativeEnumDef<T extends EnumLike = EnumLike> = ZodNativeEnumDef<T>;
type mod_ZodNativeEnum<T extends EnumLike> = ZodNativeEnum<T>;
declare const mod_ZodNativeEnum: typeof ZodNativeEnum;
type mod_ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> = ZodPromiseDef<T>;
type mod_ZodPromise<T extends ZodTypeAny> = ZodPromise<T>;
declare const mod_ZodPromise: typeof ZodPromise;
type mod_Refinement<T> = Refinement<T>;
type mod_SuperRefinement<T> = SuperRefinement<T>;
type mod_RefinementEffect<T> = RefinementEffect<T>;
type mod_TransformEffect<T> = TransformEffect<T>;
type mod_PreprocessEffect<T> = PreprocessEffect<T>;
type mod_Effect<T> = Effect<T>;
type mod_ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> = ZodEffectsDef<T>;
type mod_ZodEffects<T extends ZodTypeAny, Output = T["_output"], Input = T["_input"]> = ZodEffects<T, Output, Input>;
declare const mod_ZodEffects: typeof ZodEffects;
type mod_ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> = ZodOptionalDef<T>;
type mod_ZodOptionalType<T extends ZodTypeAny> = ZodOptionalType<T>;
type mod_ZodOptional<T extends ZodTypeAny> = ZodOptional<T>;
declare const mod_ZodOptional: typeof ZodOptional;
type mod_ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> = ZodNullableDef<T>;
type mod_ZodNullableType<T extends ZodTypeAny> = ZodNullableType<T>;
type mod_ZodNullable<T extends ZodTypeAny> = ZodNullable<T>;
declare const mod_ZodNullable: typeof ZodNullable;
type mod_ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> = ZodDefaultDef<T>;
type mod_ZodDefault<T extends ZodTypeAny> = ZodDefault<T>;
declare const mod_ZodDefault: typeof ZodDefault;
type mod_ZodNaNDef = ZodNaNDef;
type mod_ZodNaN = ZodNaN;
declare const mod_ZodNaN: typeof ZodNaN;
declare const mod_custom: typeof custom;
declare const mod_late: typeof late;
type mod_ZodFirstPartyTypeKind = ZodFirstPartyTypeKind;
declare const mod_ZodFirstPartyTypeKind: typeof ZodFirstPartyTypeKind;
type mod_ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes;
type mod_ZodIssueCode = ZodIssueCode;
type mod_ZodIssueBase = ZodIssueBase;
type mod_ZodInvalidTypeIssue = ZodInvalidTypeIssue;
type mod_ZodUnrecognizedKeysIssue = ZodUnrecognizedKeysIssue;
type mod_ZodInvalidUnionIssue = ZodInvalidUnionIssue;
type mod_ZodInvalidUnionDiscriminatorIssue = ZodInvalidUnionDiscriminatorIssue;
type mod_ZodInvalidEnumValueIssue = ZodInvalidEnumValueIssue;
type mod_ZodInvalidArgumentsIssue = ZodInvalidArgumentsIssue;
type mod_ZodInvalidReturnTypeIssue = ZodInvalidReturnTypeIssue;
type mod_ZodInvalidDateIssue = ZodInvalidDateIssue;
type mod_StringValidation = StringValidation;
type mod_ZodInvalidStringIssue = ZodInvalidStringIssue;
type mod_ZodTooSmallIssue = ZodTooSmallIssue;
type mod_ZodTooBigIssue = ZodTooBigIssue;
type mod_ZodInvalidIntersectionTypesIssue = ZodInvalidIntersectionTypesIssue;
type mod_ZodNotMultipleOfIssue = ZodNotMultipleOfIssue;
type mod_ZodCustomIssue = ZodCustomIssue;
type mod_DenormalizedError = DenormalizedError;
type mod_ZodIssueOptionalMessage = ZodIssueOptionalMessage;
type mod_ZodIssue = ZodIssue;
declare const mod_quotelessJson: typeof quotelessJson;
type mod_ZodFormattedError<T> = ZodFormattedError<T>;
type mod_ZodError<T = any> = ZodError<T>;
declare const mod_ZodError: typeof ZodError;
type mod_IssueData = IssueData;
type mod_MakeErrorData = MakeErrorData;
type mod_ZodErrorMap = ZodErrorMap;
declare const mod_defaultErrorMap: typeof defaultErrorMap;
declare const mod_overrideErrorMap: typeof overrideErrorMap;
declare const mod_setErrorMap: typeof setErrorMap;
declare namespace mod {
  export {
    mod_ZodParsedType as ZodParsedType,
    mod_getParsedType as getParsedType,
    mod_makeIssue as makeIssue,
    mod_ParseParams as ParseParams,
    mod_ParsePathComponent as ParsePathComponent,
    mod_ParsePath as ParsePath,
    mod_EMPTY_PATH as EMPTY_PATH,
    mod_ParseContext as ParseContext,
    mod_ParseInput as ParseInput,
    mod_addIssueToContext as addIssueToContext,
    mod_ObjectPair as ObjectPair,
    mod_ParseStatus as ParseStatus,
    mod_ParseResult as ParseResult,
    mod_INVALID as INVALID,
    mod_DIRTY as DIRTY,
    mod_OK as OK,
    mod_SyncParseReturnType as SyncParseReturnType,
    mod_AsyncParseReturnType as AsyncParseReturnType,
    mod_ParseReturnType as ParseReturnType,
    mod_isAborted as isAborted,
    mod_isDirty as isDirty,
    mod_isValid as isValid,
    mod_isAsync as isAsync,
    mod_Primitive as Primitive,
    mod_Scalars as Scalars,
    TypeOf as infer,
    TypeOfFlattenedError as inferFlattenedErrors,
    TypeOfFormErrors as inferFormErrors,
    ZodEffects as ZodTransformer,
    ZodType as Schema,
    ZodType as ZodSchema,
    anyType as any,
    arrayType as array,
    bigIntType as bigint,
    booleanType as boolean,
    dateType as date,
    discriminatedUnionType as discriminatedUnion,
    effectsType as effect,
    enumType as enum,
    functionType as function,
    instanceOfType as instanceof,
    intersectionType as intersection,
    lazyType as lazy,
    literalType as literal,
    mapType as map,
    nanType as nan,
    nativeEnumType as nativeEnum,
    neverType as never,
    nullType as null,
    nullableType as nullable,
    numberType as number,
    objectType as object,
    mod_oboolean as oboolean,
    mod_onumber as onumber,
    optionalType as optional,
    mod_ostring as ostring,
    preprocessType as preprocess,
    promiseType as promise,
    recordType as record,
    setType as set,
    strictObjectType as strictObject,
    stringType as string,
    effectsType as transformer,
    tupleType as tuple,
    undefinedType as undefined,
    unionType as union,
    unknownType as unknown,
    voidType as void,
    mod_RefinementCtx as RefinementCtx,
    mod_ZodRawShape as ZodRawShape,
    mod_ZodTypeAny as ZodTypeAny,
    mod_TypeOf as TypeOf,
    mod_input as input,
    mod_output as output,
    mod_TypeOfFlattenedError as TypeOfFlattenedError,
    mod_TypeOfFormErrors as TypeOfFormErrors,
    mod_CustomErrorParams as CustomErrorParams,
    mod_ZodTypeDef as ZodTypeDef,
    mod_SafeParseSuccess as SafeParseSuccess,
    mod_SafeParseError as SafeParseError,
    mod_SafeParseReturnType as SafeParseReturnType,
    mod_ZodType as ZodType,
    mod_ZodStringDef as ZodStringDef,
    mod_ZodString as ZodString,
    mod_ZodNumberDef as ZodNumberDef,
    mod_ZodNumber as ZodNumber,
    mod_ZodBigIntDef as ZodBigIntDef,
    mod_ZodBigInt as ZodBigInt,
    mod_ZodBooleanDef as ZodBooleanDef,
    mod_ZodBoolean as ZodBoolean,
    mod_ZodDateDef as ZodDateDef,
    mod_ZodDate as ZodDate,
    mod_ZodUndefinedDef as ZodUndefinedDef,
    mod_ZodUndefined as ZodUndefined,
    mod_ZodNullDef as ZodNullDef,
    mod_ZodNull as ZodNull,
    mod_ZodAnyDef as ZodAnyDef,
    mod_ZodAny as ZodAny,
    mod_ZodUnknownDef as ZodUnknownDef,
    mod_ZodUnknown as ZodUnknown,
    mod_ZodNeverDef as ZodNeverDef,
    mod_ZodNever as ZodNever,
    mod_ZodVoidDef as ZodVoidDef,
    mod_ZodVoid as ZodVoid,
    mod_ZodArrayDef as ZodArrayDef,
    mod_ArrayCardinality as ArrayCardinality,
    mod_ZodArray as ZodArray,
    mod_ZodNonEmptyArray as ZodNonEmptyArray,
    mod_objectUtil as objectUtil,
    mod_extendShape as extendShape,
    mod_ZodObjectDef as ZodObjectDef,
    mod_baseObjectOutputType as baseObjectOutputType,
    mod_objectOutputType as objectOutputType,
    mod_baseObjectInputType as baseObjectInputType,
    mod_objectInputType as objectInputType,
    mod_SomeZodObject as SomeZodObject,
    mod_ZodObject as ZodObject,
    mod_AnyZodObject as AnyZodObject,
    mod_ZodUnionDef as ZodUnionDef,
    mod_ZodUnion as ZodUnion,
    mod_ZodDiscriminatedUnionOption as ZodDiscriminatedUnionOption,
    mod_ZodDiscriminatedUnionDef as ZodDiscriminatedUnionDef,
    mod_ZodDiscriminatedUnion as ZodDiscriminatedUnion,
    mod_ZodIntersectionDef as ZodIntersectionDef,
    mod_ZodIntersection as ZodIntersection,
    mod_ZodTupleItems as ZodTupleItems,
    mod_AssertArray as AssertArray,
    mod_OutputTypeOfTuple as OutputTypeOfTuple,
    mod_OutputTypeOfTupleWithRest as OutputTypeOfTupleWithRest,
    mod_InputTypeOfTuple as InputTypeOfTuple,
    mod_InputTypeOfTupleWithRest as InputTypeOfTupleWithRest,
    mod_ZodTupleDef as ZodTupleDef,
    mod_ZodTuple as ZodTuple,
    mod_ZodRecordDef as ZodRecordDef,
    mod_ZodRecord as ZodRecord,
    mod_ZodMapDef as ZodMapDef,
    mod_ZodMap as ZodMap,
    mod_ZodSetDef as ZodSetDef,
    mod_ZodSet as ZodSet,
    mod_ZodFunctionDef as ZodFunctionDef,
    mod_OuterTypeOfFunction as OuterTypeOfFunction,
    mod_InnerTypeOfFunction as InnerTypeOfFunction,
    mod_ZodFunction as ZodFunction,
    mod_ZodLazyDef as ZodLazyDef,
    mod_ZodLazy as ZodLazy,
    mod_ZodLiteralDef as ZodLiteralDef,
    mod_ZodLiteral as ZodLiteral,
    mod_ArrayKeys as ArrayKeys,
    mod_Indices as Indices,
    mod_ZodEnumDef as ZodEnumDef,
    mod_ZodEnum as ZodEnum,
    mod_ZodNativeEnumDef as ZodNativeEnumDef,
    mod_ZodNativeEnum as ZodNativeEnum,
    mod_ZodPromiseDef as ZodPromiseDef,
    mod_ZodPromise as ZodPromise,
    mod_Refinement as Refinement,
    mod_SuperRefinement as SuperRefinement,
    mod_RefinementEffect as RefinementEffect,
    mod_TransformEffect as TransformEffect,
    mod_PreprocessEffect as PreprocessEffect,
    mod_Effect as Effect,
    mod_ZodEffectsDef as ZodEffectsDef,
    mod_ZodEffects as ZodEffects,
    mod_ZodOptionalDef as ZodOptionalDef,
    mod_ZodOptionalType as ZodOptionalType,
    mod_ZodOptional as ZodOptional,
    mod_ZodNullableDef as ZodNullableDef,
    mod_ZodNullableType as ZodNullableType,
    mod_ZodNullable as ZodNullable,
    mod_ZodDefaultDef as ZodDefaultDef,
    mod_ZodDefault as ZodDefault,
    mod_ZodNaNDef as ZodNaNDef,
    mod_ZodNaN as ZodNaN,
    mod_custom as custom,
    mod_late as late,
    mod_ZodFirstPartyTypeKind as ZodFirstPartyTypeKind,
    mod_ZodFirstPartySchemaTypes as ZodFirstPartySchemaTypes,
    mod_ZodIssueCode as ZodIssueCode,
    mod_ZodIssueBase as ZodIssueBase,
    mod_ZodInvalidTypeIssue as ZodInvalidTypeIssue,
    mod_ZodUnrecognizedKeysIssue as ZodUnrecognizedKeysIssue,
    mod_ZodInvalidUnionIssue as ZodInvalidUnionIssue,
    mod_ZodInvalidUnionDiscriminatorIssue as ZodInvalidUnionDiscriminatorIssue,
    mod_ZodInvalidEnumValueIssue as ZodInvalidEnumValueIssue,
    mod_ZodInvalidArgumentsIssue as ZodInvalidArgumentsIssue,
    mod_ZodInvalidReturnTypeIssue as ZodInvalidReturnTypeIssue,
    mod_ZodInvalidDateIssue as ZodInvalidDateIssue,
    mod_StringValidation as StringValidation,
    mod_ZodInvalidStringIssue as ZodInvalidStringIssue,
    mod_ZodTooSmallIssue as ZodTooSmallIssue,
    mod_ZodTooBigIssue as ZodTooBigIssue,
    mod_ZodInvalidIntersectionTypesIssue as ZodInvalidIntersectionTypesIssue,
    mod_ZodNotMultipleOfIssue as ZodNotMultipleOfIssue,
    mod_ZodCustomIssue as ZodCustomIssue,
    mod_DenormalizedError as DenormalizedError,
    mod_ZodIssueOptionalMessage as ZodIssueOptionalMessage,
    mod_ZodIssue as ZodIssue,
    mod_quotelessJson as quotelessJson,
    mod_ZodFormattedError as ZodFormattedError,
    mod_ZodError as ZodError,
    mod_IssueData as IssueData,
    mod_MakeErrorData as MakeErrorData,
    mod_ZodErrorMap as ZodErrorMap,
    mod_defaultErrorMap as defaultErrorMap,
    mod_overrideErrorMap as overrideErrorMap,
    mod_setErrorMap as setErrorMap,
  };
}

declare namespace schema {
  export {
    mod as define,
  };
}

declare function decode(input: string): object;
declare function encode(content: any): string;

declare const toml_decode: typeof decode;
declare const toml_encode: typeof encode;
declare namespace toml {
  export {
    toml_decode as decode,
    toml_encode as encode,
  };
}

interface CreateOptions {
    port: number;
    authToken: string;
}
declare function create(options: CreateOptions): Promise<string>;

declare const tunnel_create: typeof create;
declare namespace tunnel {
  export {
    tunnel_create as create,
  };
}

/**
 * JSON Schema
 *
 * Documentation corresponds to the work-in-progress draft-07 of JSON Schema.
 *
 * The latest published drafts are:
 * - draft-handrews-json-schema-01
 * - draft-handrews-json-schema-validation-01
 *
 * For more information, visit: http://json-schema.org/.
 *
 * Draft date: March 19, 2018.
 *
 * @public
 */
interface JSONSchema {
  /**
   * This keyword is reserved for comments from schema authors to readers or
   * maintainers of the schema. The value of this keyword MUST be a string.
   * Implementations MUST NOT present this string to end users. Tools for
   * editing schemas SHOULD support displaying and editing this keyword.
   *
   * The value of this keyword MAY be used in debug or error output which is
   * intended for developers making use of schemas. Schema vocabularies SHOULD
   * allow "$comment" within any object containing vocabulary keywords.
   *
   * Implementations MAY assume "$comment" is allowed unless the vocabulary
   * specifically forbids it. Vocabularies MUST NOT specify any effect of
   * "$comment" beyond what is described in this specification. Tools that
   * translate other media types or programming languages to and from
   * application/schema+json MAY choose to convert that media type or
   * programming language's native comments to or from "$comment" values.
   *
   * The behavior of such translation when both native comments and "$comment"
   * properties are present is implementation-dependent. Implementations SHOULD
   * treat "$comment" identically to an unknown extension keyword.
   *
   * They MAY strip "$comment" values at any point during processing. In
   * particular, this allows for shortening schemas when the size of deployed
   * schemas is a concern. Implementations MUST NOT take any other action based
   * on the presence, absence, or contents of "$comment" properties.
   */
  $comment?: string
  /**
   * The "$id" keyword defines a URI for the schema, and the base URI that other
   * URI references within the schema are resolved against. A subschema's "$id"
   * is resolved against the base URI of its parent schema. If no parent sets an
   * explicit base with "$id", the base URI is that of the entire document, as
   * determined per [RFC 3986 section 5][RFC3986].
   *
   * If present, the value for this keyword MUST be a string, and MUST represent
   * a valid [URI-reference][RFC3986]. This value SHOULD be normalized, and
   * SHOULD NOT be an empty fragment <#> or an empty string <>.
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-core.html#RFC3986
   */
  $id?: string
  /**
   * The "$ref" keyword is used to reference a schema, and provides the ability
   * to validate recursive structures through self-reference.
   *
   * An object schema with a "$ref" property MUST be interpreted as a "$ref"
   * reference. The value of the "$ref" property MUST be a URI Reference.
   * Resolved against the current URI base, it identifies the URI of a schema to
   * use. All other properties in a "$ref" object MUST be ignored.
   *
   * The URI is not a network locator, only an identifier. A schema need not be
   * downloadable from the address if it is a network-addressable URL, and
   * implementations SHOULD NOT assume they should perform a network operation
   * when they encounter a network-addressable URI.
   *
   * A schema MUST NOT be run into an infinite loop against a schema. For
   * example, if two schemas "#alice" and "#bob" both have an "allOf" property
   * that refers to the other, a naive validator might get stuck in an infinite
   * recursive loop trying to validate the instance. Schemas SHOULD NOT make use
   * of infinite recursive nesting like this; the behavior is undefined.
   */
  $ref?: string
  /**
   * The "$schema" keyword is both used as a JSON Schema version identifier and
   * the location of a resource which is itself a JSON Schema, which describes
   * any schema written for this particular version.
   *
   * The value of this keyword MUST be a [URI][RFC3986] (containing a scheme)
   * and this URI MUST be normalized. The current schema MUST be valid against
   * the meta-schema identified by this URI.
   *
   * If this URI identifies a retrievable resource, that resource SHOULD be of
   * media type "application/schema+json".
   *
   * The "$schema" keyword SHOULD be used in a root schema. It MUST NOT appear
   * in subschemas.
   *
   * Values for this property are defined in other documents and by other
   * parties. JSON Schema implementations SHOULD implement support for current
   * and previous published drafts of JSON Schema vocabularies as deemed
   * reasonable.
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-core.html#RFC3986
   */
  $schema?: string
  /**
   * The value of "additionalItems" MUST be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for arrays, and does
   * not directly validate the immediate instance itself.
   *
   * If "items" is an array of schemas, validation succeeds if every instance
   * element at a position greater than the size of "items" validates against
   * "additionalItems".
   *
   * Otherwise, "additionalItems" MUST be ignored, as the "items" schema
   * (possibly the default value of an empty schema) is applied to all elements.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  additionalItems?: JSONSchema | boolean
  /**
   * The value of "additionalProperties" MUST be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself.
   *
   * Validation with "additionalProperties" applies only to the child values of
   * instance names that do not match any names in "properties", and do not
   * match any regular expression in "patternProperties".
   *
   * For all such properties, validation succeeds if the child instance
   * validates against the "additionalProperties" schema.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  additionalProperties?: JSONSchema | boolean
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against all schemas defined by this keyword's value.
   */
  allOf?: (JSONSchema | boolean)[]
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against at least one schema defined by this keyword's value.
   */
  anyOf?: (JSONSchema | boolean)[]
  /**
   * The value of this keyword MAY be of any type, including null.
   *
   * An instance validates successfully against this keyword if its value is
   * equal to the value of the keyword.
   */
  const?: any
  /**
   * The value of this keyword MUST be a valid JSON Schema.
   *
   * An array instance is valid against "contains" if at least one of its
   * elements is valid against the given schema.
   */
  contains?: JSONSchema | boolean
  /**
   * If the instance value is a string, this property defines that the string
   * SHOULD be interpreted as binary data and decoded using the encoding named
   * by this property. [RFC 2045, Sec 6.1][RFC2045] lists the possible values for
   * this property.
   *
   * The value of this property SHOULD be ignored if the instance described is
   * not a string.
   *
   * [RFC2045]: https://tools.ietf.org/html/rfc2045#section-6.1
   */
  contentEncoding?: JSONSchemaContentEncodingName | JSONSchemaContentEncoding
  /**
   * The value of this property must be a media type, as defined by
   * [RFC 2046][RFC2046]. This property defines the media type of instances
   * which this schema defines.
   *
   * The value of this property SHOULD be ignored if the instance described is
   * not a string.
   *
   * If the "contentEncoding" property is not present, but the instance value is
   * a string, then the value of this property SHOULD specify a text document
   * type, and the character set SHOULD be the character set into which the
   * JSON string value was decoded (for which the default is Unicode).
   *
   * [RFC2046]: https://tools.ietf.org/html/rfc2046
   */
  contentMediaType?: string
  /**
   * There are no restrictions placed on the value of this keyword. When
   * multiple occurrences of this keyword are applicable to a single
   * sub-instance, implementations SHOULD remove duplicates.
   *
   * This keyword can be used to supply a default JSON value associated with a
   * particular schema. It is RECOMMENDED that a default value be valid against
   * the associated schema.
   */
  default?: any
  /**
   * The "definitions" keywords provides a standardized location for schema
   * authors to inline re-usable JSON Schemas into a more general schema. The
   * keyword does not directly affect the validation result.
   *
   * This keyword's value MUST be an object. Each member value of this object
   * MUST be a valid JSON Schema.
   */
  definitions?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * This keyword specifies rules that are evaluated if the instance is an
   * object and contains a certain property.
   *
   * This keyword's value MUST be an object. Each property specifies a
   * dependency. Each dependency value MUST be an array or a valid JSON Schema.
   *
   * If the dependency value is a subschema, and the dependency key is a
   * property in the instance, the entire instance must validate against the
   * dependency value.
   *
   * If the dependency value is an array, each element in the array, if any,
   * MUST be a string, and MUST be unique. If the dependency key is a property
   * in the instance, each of the items in the dependency value must be a
   * property that exists in the instance.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  dependencies?:
    | {
        [key: string]: JSONSchema | boolean | string[]
      }
    | string[]
  /**
   * Can be used to decorate a user interface with explanation or information
   * about the data produced.
   */
  description?: string
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * When "if" is present, and the instance fails to validate against its
   * subschema, then validation succeeds against this keyword if the instance
   * successfully validates against this keyword's subschema.
   *
   * This keyword has no effect when "if" is absent, or when the instance
   * successfully validates against its subschema. Implementations MUST NOT
   * evaluate the instance against this keyword, for either validation or
   * annotation collection purposes, in such cases.
   */
  else?: JSONSchema | boolean
  /**
   * The value of this keyword MUST be an array. This array SHOULD have at least
   * one element. Elements in the array SHOULD be unique.
   *
   * An instance validates successfully against this keyword if its value is
   * equal to one of the elements in this keyword's array value.
   *
   * Elements in the array might be of any value, including null.
   */
  enum?: any[]
  /**
   * The value of this keyword MUST be an array. There are no restrictions
   * placed on the values within the array. When multiple occurrences of this
   * keyword are applicable to a single sub-instance, implementations MUST
   * provide a flat array of all values rather than an array of arrays.
   *
   * This keyword can be used to provide sample JSON values associated with a
   * particular schema, for the purpose of illustrating usage. It is RECOMMENDED
   * that these values be valid against the associated schema.
   *
   * Implementations MAY use the value(s) of "default", if present, as an
   * additional example. If "examples" is absent, "default" MAY still be used in
   * this manner.
   */
  examples?: any[]
  /**
   * The value of "exclusiveMaximum" MUST be number, representing an exclusive
   * upper limit for a numeric instance.
   *
   * If the instance is a number, then the instance is valid only if it has a
   * value strictly less than (not equal to) "exclusiveMaximum".
   */
  exclusiveMaximum?: number
  /**
   * The value of "exclusiveMinimum" MUST be number, representing an exclusive
   * lower limit for a numeric instance.
   *
   * If the instance is a number, then the instance is valid only if it has a
   * value strictly greater than (not equal to) "exclusiveMinimum".
   */
  exclusiveMinimum?: number
  /**
   * The "format" keyword functions as both an [annotation][annotation] and as
   * an [assertion][assertion]. While no special effort is required to implement
   * it as an annotation conveying semantic meaning, implementing validation is
   * non-trivial.
   *
   * Implementations MAY support the "format" keyword as a validation assertion.
   * Should they choose to do so:
   *
   *  - they SHOULD implement validation for attributes defined below;
   *  - they SHOULD offer an option to disable validation for this keyword.
   *
   * Implementations MAY add custom format attributes. Save for agreement
   * between parties, schema authors SHALL NOT expect a peer implementation to
   * support this keyword and/or custom format attributes.
   *
   * [annotation]: http://json-schema.org/latest/json-schema-validation.html#annotations
   * [assertion]: http://json-schema.org/latest/json-schema-validation.html#assertions
   */
  format?:
    | JSONSchemaFormat
    | 'date'
    | 'date-time'
    | 'email'
    | 'full-date'
    | 'full-time'
    | 'hostname'
    | 'idn-email'
    | 'idn-hostname'
    | 'ipv4'
    | 'ipv6'
    | 'iri'
    | 'iri-reference'
    | 'json-pointer'
    | 'json-pointer-uri-fragment'
    | 'regex'
    | 'relative-json-pointer'
    | 'time'
    | 'uri'
    | 'uri-reference'
    | 'uri-template'
    | 'uuid'
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * This validation outcome of this keyword's subschema has no direct effect on
   * the overall validation result. Rather, it controls which of the "then" or
   * "else" keywords are evaluated.
   *
   * Instances that successfully validate against this keyword's subschema MUST
   * also be valid against the subschema value of the "then" keyword, if
   * present.
   *
   * Instances that fail to validate against this keyword's subschema MUST also
   * be valid against the subschema value of the "else" keyword, if present.
   *
   * If [annotations][annotations] are being collected, they are collected from
   * this keyword's subschema in the usual way, including when the keyword is
   * present without either "then" or "else".
   *
   * [annotations]: http://json-schema.org/latest/json-schema-validation.html#annotations
   */
  if?: JSONSchema | boolean
  /**
   * The value of "items" MUST be either a valid JSON Schema or an array of
   * valid JSON Schemas.
   *
   * This keyword determines how child instances validate for arrays, and does
   * not directly validate the immediate instance itself.
   *
   * If "items" is a schema, validation succeeds if all elements in the array
   * successfully validate against that schema.
   *
   * If "items" is an array of schemas, validation succeeds if each element of
   * the instance validates against the schema at the same position, if any.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  items?: JSONSchema | boolean | (JSONSchema | boolean)[]
  /**
   * The value of "maximum" MUST be a number, representing an inclusive upper
   * limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates only if the
   * instance is less than or exactly equal to "maximum".
   */
  maximum?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An array instance is valid against "maxItems" if its size is less than, or
   * equal to, the value of this keyword.
   */
  maxItems?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * A string instance is valid against this keyword if its length is less than,
   * or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters
   * as defined by [RFC 7159][RFC7159].
   *
   * [RFC7159]: http://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  maxLength?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An object instance is valid against "maxProperties" if its number of
   * properties is less than, or equal to, the value of this keyword.
   */
  maxProperties?: number
  /**
   * The value of "minimum" MUST be a number, representing an inclusive lower
   * limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates only if the
   * instance is greater than or exactly equal to "minimum".
   */
  minimum?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * A string instance is valid against this keyword if its length is greater
   * than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters
   * as defined by [RFC 7159][RFC7159].
   *
   * Omitting this keyword has the same behavior as a value of 0.
   *
   * [RFC7159]: http://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  minLength?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An array instance is valid against "minItems" if its size is greater than,
   * or equal to, the value of this keyword.
   *
   * Omitting this keyword has the same behavior as a value of 0.
   */
  minItems?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An object instance is valid against "minProperties" if its number of
   * properties is greater than, or equal to, the value of this keyword.
   *
   * Omitting this keyword has the same behavior as a value of 0.
   */
  minProperties?: number
  /**
   * The value of "multipleOf" MUST be a number, strictly greater than 0.
   *
   * A numeric instance is valid only if division by this keyword's value
   * results in an integer.
   */
  multipleOf?: number
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * An instance is valid against this keyword if it fails to validate
   * successfully against the schema defined by this keyword.
   */
  not?: JSONSchema | boolean
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against exactly one schema defined by this keyword's value.
   */
  oneOf?: (JSONSchema | boolean)[]
  /**
   * The value of this keyword MUST be a string. This string SHOULD be a valid
   * regular expression, according to the ECMA 262 regular expression dialect.
   *
   * A string instance is considered valid if the regular expression matches the
   * instance successfully. Recall: regular expressions are not implicitly
   * anchored.
   */
  pattern?: string
  /**
   * The value of "patternProperties" MUST be an object. Each property name of
   * this object SHOULD be a valid regular expression, according to the ECMA 262
   * regular expression dialect. Each property value of this object MUST be a
   * valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself. Validation of the
   * primitive instance type against this keyword always succeeds.
   *
   * Validation succeeds if, for each instance name that matches any regular
   * expressions that appear as a property name in this keyword's value, the
   * child instance for that name successfully validates against each schema
   * that corresponds to a matching regular expression.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  patternProperties?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * The value of "properties" MUST be an object. Each value of this object MUST
   * be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself.
   *
   * Validation succeeds if, for each name that appears in both the instance and
   * as a name within this keyword's value, the child instance for that name
   * successfully validates against the corresponding schema.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  properties?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * The value of "propertyNames" MUST be a valid JSON Schema.
   *
   * If the instance is an object, this keyword validates if every property name
   * in the instance validates against the provided schema. Note the property
   * name that the schema is testing will always be a string.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  propertyNames?: JSONSchema | boolean
  /**
   * The value of this keywords MUST be a boolean. When multiple occurrences of
   * this keyword are applicable to a single sub-instance, the resulting value
   * MUST be true if any occurrence specifies a true value, and MUST be false
   * otherwise.
   *
   * If "readOnly" has a value of boolean true, it indicates that the value of
   * the instance is managed exclusively by the owning authority, and attempts
   * by an application to modify the value of this property are expected to be
   * ignored or rejected by that owning authority.
   *
   * An instance document that is marked as "readOnly for the entire document
   * MAY be ignored if sent to the owning authority, or MAY result in an error,
   * at the authority's discretion.
   *
   * For example, "readOnly" would be used to mark a database-generated serial
   * number as read-only.
   *
   * This keywords can be used to assist in user interface instance generation.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * The value of this keyword MUST be an array. Elements of this array, if any,
   * MUST be strings, and MUST be unique.
   *
   * An object instance is valid against this keyword if every item in the array
   * is the name of a property in the instance.
   *
   * Omitting this keyword has the same behavior as an empty array.
   *
   * @default []
   */
  required?: string[]
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * When "if" is present, and the instance successfully validates against its
   * subschema, then validation succeeds against this keyword if the instance
   * also successfully validates against this keyword's subschema.
   *
   * This keyword has no effect when "if" is absent, or when the instance fails
   * to validate against its subschema. Implementations MUST NOT evaluate the
   * instance against this keyword, for either validation or annotation
   * collection purposes, in such cases.
   */
  then?: JSONSchema | boolean
  /**
   * Can be used to decorate a user interface with a short label about the data
   * produced.
   */
  title?: string
  /**
   * The value of this keyword MUST be either a string or an array. If it is an
   * array, elements of the array MUST be strings and MUST be unique.
   *
   * String values MUST be one of the six primitive types ("null", "boolean",
   * "object", "array", "number", or "string"), or "integer" which matches any
   * number with a zero fractional part.
   *
   * An instance validates if and only if the instance is in any of the sets
   * listed for this keyword.
   */
  type?:
    | JSONSchemaType
    | JSONSchemaTypeName
    | (JSONSchemaType | JSONSchemaTypeName)[]
  /**
   * The value of this keyword MUST be a boolean.
   *
   * If this keyword has boolean value false, the instance validates
   * successfully. If it has boolean value true, the instance validates
   * successfully if all of its elements are unique.
   *
   * Omitting this keyword has the same behavior as a value of false.
   *
   * @default false
   */
  uniqueItems?: boolean
  /**
   * The value of this keyword MUST be a boolean. When multiple occurrences of
   * this keyword is applicable to a single sub-instance, the resulting value
   * MUST be true if any occurrence specifies a true value, and MUST be false
   * otherwise.
   *
   * If "writeOnly" has a value of boolean true, it indicates that the value is
   * never present when the instance is retrieved from the owning authority. It
   * can be present when sent to the owning authority to update or create the
   * document (or the resource it represents), but it will not be included in
   * any updated or newly created version of the instance.
   *
   * An instance document that is marked as "writeOnly" for the entire document
   * MAY be returned as a blank document of some sort, or MAY produce an error
   * upon retrieval, or have the retrieval request ignored, at the authority's
   * discretion.
   *
   * For example, "writeOnly" would be used to mark a password input field.
   *
   * These keywords can be used to assist in user interface instance generation.
   * In particular, an application MAY choose to use a widget that hides input
   * values as they are typed for write-only fields.
   *
   * @default false
   */
  writeOnly?: boolean
}
/**
 * String formats.
 *
 * @public
 */
declare enum JSONSchemaFormat {
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "full-date" production in
   * [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  Date = 'date',
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "date-time" production in
   * [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  DateTime = 'date-time',
  /**
   * A string instance is valid against these attributes if it is a valid
   * Internet email address as defined by [RFC 5322, section 3.4.1][RFC5322].
   *
   * [RFC5322]: http://json-schema.org/latest/json-schema-validation.html#RFC5322
   */
  Email = 'email',
  /**
   * As defined by [RFC 1034, section 3.1][RFC1034], including host names
   * produced using the Punycode algorithm specified in
   * [RFC 5891, section 4.4][RFC5891].
   *
   * [RFC1034]: http://json-schema.org/latest/json-schema-validation.html#RFC1034
   * [RFC5891]: http://json-schema.org/latest/json-schema-validation.html#RFC5891
   */
  Hostname = 'hostname',
  /**
   * A string instance is valid against these attributes if it is a valid
   * Internet email address as defined by [RFC 6531][RFC6531].
   *
   * [RFC6531]: http://json-schema.org/latest/json-schema-validation.html#RFC6531
   */
  IDNEmail = 'idn-email',
  /**
   * As defined by either [RFC 1034, section 3.1][RFC1034] as for hostname, or
   * an internationalized hostname as defined by
   * [RFC 5890, section 2.3.2.3][RFC5890].
   *
   * [RFC1034]: http://json-schema.org/latest/json-schema-validation.html#RFC1034
   * [RFC5890]: http://json-schema.org/latest/json-schema-validation.html#RFC5890
   */
  IDNHostname = 'idn-hostname',
  /**
   * An IPv4 address according to the "dotted-quad" ABNF syntax as defined in
   * [RFC 2673, section 3.2][RFC2673].
   *
   * [RFC2673]: http://json-schema.org/latest/json-schema-validation.html#RFC2673
   */
  IPv4 = 'ipv4',
  /**
   * An IPv6 address as defined in [RFC 4291, section 2.2][RFC4291].
   *
   * [RFC4291]: http://json-schema.org/latest/json-schema-validation.html#RFC4291
   */
  IPv6 = 'ipv6',
  /**
   * A string instance is valid against this attribute if it is a valid IRI,
   * according to [RFC3987][RFC3987].
   *
   * [RFC3987]: http://json-schema.org/latest/json-schema-validation.html#RFC3987
   */
  IRI = 'iri',
  /**
   * A string instance is valid against this attribute if it is a valid IRI
   * Reference (either an IRI or a relative-reference), according to
   * [RFC3987][RFC3987].
   *
   * [RFC3987]: http://json-schema.org/latest/json-schema-validation.html#RFC3987
   */
  IRIReference = 'iri-reference',
  /**
   * A string instance is valid against this attribute if it is a valid JSON
   * string representation of a JSON Pointer, according to
   * [RFC 6901, section 5][RFC6901].
   *
   * [RFC6901]: http://json-schema.org/latest/json-schema-validation.html#RFC6901
   */
  JSONPointer = 'json-pointer',
  /**
   * A string instance is valid against this attribute if it is a valid JSON
   * string representation of a JSON Pointer fragment, according to
   * [RFC 6901, section 5][RFC6901].
   *
   * [RFC6901]: http://json-schema.org/latest/json-schema-validation.html#RFC6901
   */
  JSONPointerURIFragment = 'json-pointer-uri-fragment',
  /**
   * This attribute applies to string instances.
   *
   * A regular expression, which SHOULD be valid according to the
   * [ECMA 262][ecma262] regular expression dialect.
   *
   * Implementations that validate formats MUST accept at least the subset of
   * [ECMA 262][ecma262] defined in the [Regular Expressions][regexInterop]
   * section of this specification, and SHOULD accept all valid
   * [ECMA 262][ecma262] expressions.
   *
   * [ecma262]: http://json-schema.org/latest/json-schema-validation.html#ecma262
   * [regexInterop]: http://json-schema.org/latest/json-schema-validation.html#regexInterop
   */
  RegEx = 'regex',
  /**
   * A string instance is valid against this attribute if it is a valid
   * [Relative JSON Pointer][relative-json-pointer].
   *
   * [relative-json-pointer]: http://json-schema.org/latest/json-schema-validation.html#relative-json-pointer
   */
  RelativeJSONPointer = 'relative-json-pointer',
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "time" production in [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  Time = 'time',
  /**
   * A string instance is valid against this attribute if it is a valid URI,
   * according to [RFC3986][RFC3986].
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-validation.html#RFC3986
   */
  URI = 'uri',
  /**
   * A string instance is valid against this attribute if it is a valid URI
   * Reference (either a URI or a relative-reference), according to
   * [RFC3986][RFC3986].
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-validation.html#RFC3986
   */
  URIReference = 'uri-reference',
  /**
   * A string instance is valid against this attribute if it is a valid URI
   * Template (of any level), according to [RFC6570][RFC6570].
   *
   * Note that URI Templates may be used for IRIs; there is no separate IRI
   * Template specification.
   *
   * [RFC6570]: http://json-schema.org/latest/json-schema-validation.html#RFC6570
   */
  URITemplate = 'uri-template',
  /**
   * UUID
   */
  UUID = 'uuid'
}
/**
 * JSON Schema type.
 *
 * @public
 */
declare type JSONSchemaTypeName =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
/**
 * JSON Schema type.
 *
 * @public
 */
declare enum JSONSchemaType {
  /**
   * Array
   */
  Array = 'array',
  /**
   * Boolean
   */
  Boolean = 'boolean',
  /**
   * Integer
   */
  Integer = 'integer',
  /**
   * Null
   */
  Null = 'null',
  /**
   * Number
   */
  Number = 'number',
  /**
   * Object
   */
  Object = 'object',
  /**
   * String
   */
  String = 'string'
}
/**
 * Content encoding name.
 *
 * @public
 */
declare type JSONSchemaContentEncodingName =
  | '7bit'
  | '8bit'
  | 'binary'
  | 'quoted-printable'
  | 'base64'
  | 'ietf-token'
  | 'x-token'
/**
 * Content encoding strategy.
 *
 * @public
 * {@link https://tools.ietf.org/html/rfc2045#section-6.1}
 * {@link https://stackoverflow.com/questions/25710599/content-transfer-encoding-7bit-or-8-bit/28531705#28531705}
 */
declare enum JSONSchemaContentEncoding {
  /**
   * Only US-ASCII characters, which use the lower 7 bits for each character.
   *
   * Each line must be less than 1,000 characters.
   */
  '7bit' = '7bit',
  /**
   * Allow extended ASCII characters which can use the 8th (highest) bit to
   * indicate special characters not available in 7bit.
   *
   * Each line must be less than 1,000 characters.
   */
  '8bit' = '8bit',
  /**
   * Same character set as 8bit, with no line length restriction.
   */
  Binary = 'binary',
  /**
   * Lines are limited to 76 characters, and line breaks are represented using
   * special characters that are escaped.
   */
  QuotedPrintable = 'quoted-printable',
  /**
   * Useful for data that is mostly non-text.
   */
  Base64 = 'base64',
  /**
   * An extension token defined by a standards-track RFC and registered with
   * IANA.
   */
  IETFToken = 'ietf-token',
  /**
   * The two characters "X-" or "x-" followed, with no intervening white space,
   * by any token.
   */
  XToken = 'x-token'
}

interface Options<T extends Record<string, any>> {
    /**
    Config used if there are no existing config.

    **Note:** The values in `defaults` will overwrite the `default` key in the `schema` option.
    */
    defaults?: Readonly<T>;
    /**
    [JSON Schema](https://json-schema.org) to validate your config data.

    Under the hood, the JSON Schema validator [ajv](https://github.com/epoberezkin/ajv) is used to validate your config. We use [JSON Schema draft-07](https://json-schema.org/latest/json-schema-validation.html) and support all [validation keywords](https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md) and [formats](https://github.com/epoberezkin/ajv#formats).

    You should define your schema as an object where each key is the name of your data's property and each value is a JSON schema used to validate that property. See more [here](https://json-schema.org/understanding-json-schema/reference/object.html#properties).

    @example
    ```
    import Conf = require('conf');

    const schema = {
        foo: {
            type: 'number',
            maximum: 100,
            minimum: 1,
            default: 50
        },
        bar: {
            type: 'string',
            format: 'url'
        }
    };

    const config = new Conf({schema});

    console.log(config.get('foo'));
    //=> 50

    config.set('foo', '1');
    // [Error: Config schema violation: `foo` should be number]
    ```

    **Note:** The `default` value will be overwritten by the `defaults` option if set.
    */
    schema?: Schema<T>;
    /**
    Name of the config file (without extension).

    Useful if you need multiple config files for your app or module. For example, different config files between two major versions.

    @default 'config'
    */
    configName?: string;
    /**
    You only need to specify this if you don't have a package.json file in your project or if it doesn't have a name defined within it.

    Default: The name field in the `package.json` closest to where `conf` is imported.
    */
    projectName?: string;
    /**
    You only need to specify this if you don't have a package.json file in your project or if it doesn't have a version defined within it.

    Default: The name field in the `package.json` closest to where `conf` is imported.
    */
    projectVersion?: string;
    /**
    You can use migrations to perform operations to the store whenever a version is changed.

    The `migrations` object should consist of a key-value pair of `'version': handler`. The `version` can also be a [semver range](https://github.com/npm/node-semver#ranges).

    Note: The version the migrations use refers to the __project version__ by default. If you want to change this behavior, specify the `projectVersion` option.

    @example
    ```
    import Conf = require('conf');

    const store = new Conf({
        migrations: {
            '0.0.1': store => {
                store.set('debugPhase', true);
            },
            '1.0.0': store => {
                store.delete('debugPhase');
                store.set('phase', '1.0.0');
            },
            '1.0.2': store => {
                store.set('phase', '1.0.2');
            },
            '>=2.0.0': store => {
                store.set('phase', '>=2.0.0');
            }
        }
    });
    ```
    */
    migrations?: Migrations<T>;
    /**
    __You most likely don't need this. Please don't use it unless you really have to.__

    The only use-case I can think of is having the config located in the app directory or on some external storage. Default: System default user [config directory](https://github.com/sindresorhus/env-paths#pathsconfig).
    */
    cwd?: string;
    /**
    Note that this is __not intended for security purposes__, since the encryption key would be easily found inside a plain-text Node.js app.

    Its main use is for obscurity. If a user looks through the config directory and finds the config file, since it's just a JSON file, they may be tempted to modify it. By providing an encryption key, the file will be obfuscated, which should hopefully deter any users from doing so.

    It also has the added bonus of ensuring the config file's integrity. If the file is changed in any way, the decryption will not work, in which case the store will just reset back to its default state.

    When specified, the store will be encrypted using the [`aes-256-cbc`](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) encryption algorithm.
    */
    encryptionKey?: string | Buffer | NodeJS.TypedArray | DataView;
    /**
    Extension of the config file.

    You would usually not need this, but could be useful if you want to interact with a file with a custom file extension that can be associated with your app. These might be simple save/export/preference files that are intended to be shareable or saved outside of the app.

    @default 'json'
    */
    fileExtension?: string;
    /**
    The config is cleared if reading the config file causes a `SyntaxError`. This is a good behavior for unimportant data, as the config file is not intended to be hand-edited, so it usually means the config is corrupt and there's nothing the user can do about it anyway. However, if you let the user edit the config file directly, mistakes might happen and it could be more useful to throw an error when the config is invalid instead of clearing.

    @default false
    */
    clearInvalidConfig?: boolean;
    /**
    Function to serialize the config object to a UTF-8 string when writing the config file.

    You would usually not need this, but it could be useful if you want to use a format other than JSON.

    @default value => JSON.stringify(value, null, '\t')
    */
    readonly serialize?: Serialize<T>;
    /**
    Function to deserialize the config object from a UTF-8 string when reading the config file.

    You would usually not need this, but it could be useful if you want to use a format other than JSON.

    @default JSON.parse
    */
    readonly deserialize?: Deserialize<T>;
    /**
    __You most likely don't need this. Please don't use it unless you really have to.__

    Suffix appended to `projectName` during config file creation to avoid name conflicts with native apps.

    You can pass an empty string to remove the suffix.

    For example, on macOS, the config file will be stored in the `~/Library/Preferences/foo-nodejs` directory, where `foo` is the `projectName`.

    @default 'nodejs'
    */
    readonly projectSuffix?: string;
    /**
    Access nested properties by dot notation.

    @default true

    @example
    ```
    const config = new Conf();

    config.set({
        foo: {
            bar: {
                foobar: '🦄'
            }
        }
    });

    console.log(config.get('foo.bar.foobar'));
    //=> '🦄'
    ```

    Alternatively, you can set this option to `false` so the whole string would be treated as one key.

    @example
    ```
    const config = new Conf({accessPropertiesByDotNotation: false});

    config.set({
        `foo.bar.foobar`: '🦄'
    });

    console.log(config.get('foo.bar.foobar'));
    //=> '🦄'
    ```

    */
    readonly accessPropertiesByDotNotation?: boolean;
    /**
    Watch for any changes in the config file and call the callback for `onDidChange` or `onDidAnyChange` if set. This is useful if there are multiple processes changing the same config file.

    @default false
    */
    readonly watch?: boolean;
    /**
    The [mode](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) that will be used for the config file.

    You would usually not need this, but it could be useful if you want to restrict the permissions of the config file. Setting a permission such as `0o600` would result in a config file that can only be accessed by the user running the program.

    Note that setting restrictive permissions can cause problems if different users need to read the file. A common problem is a user running your tool with and without `sudo` and then not being able to access the config the second time.

    @default 0o666
    */
    readonly configFileMode?: number;
}
declare type Migrations<T extends Record<string, any>> = Record<string, (store: Conf<T>) => void>;
declare type Schema<T> = {
    [Property in keyof T]: ValueSchema;
};
declare type ValueSchema = JSONSchema;
declare type Serialize<T> = (value: T) => string;
declare type Deserialize<T> = (text: string) => T;
declare type OnDidChangeCallback<T> = (newValue?: T, oldValue?: T) => void;
declare type OnDidAnyChangeCallback<T> = (newValue?: Readonly<T>, oldValue?: Readonly<T>) => void;
declare type Unsubscribe = () => EventEmitter;

declare class Conf<T extends Record<string, any> = Record<string, unknown>> implements Iterable<[keyof T, T[keyof T]]> {
    #private;
    readonly path: string;
    readonly events: EventEmitter;
    constructor(partialOptions?: Readonly<Partial<Options<T>>>);
    /**
    Get an item.

    @param key - The key of the item to get.
    @param defaultValue - The default value if the item does not exist.
    */
    get<Key extends keyof T>(key: Key): T[Key];
    get<Key extends keyof T>(key: Key, defaultValue: Required<T>[Key]): Required<T>[Key];
    get<Key extends string, Value = unknown>(key: Exclude<Key, keyof T>, defaultValue?: Value): Value;
    /**
    Set an item or multiple items at once.

    @param {key|object} - You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties. Or a hashmap of items to set at once.
    @param value - Must be JSON serializable. Trying to set the type `undefined`, `function`, or `symbol` will result in a `TypeError`.
    */
    set<Key extends keyof T>(key: Key, value?: T[Key]): void;
    set(key: string, value: unknown): void;
    set(object: Partial<T>): void;
    /**
    Check if an item exists.

    @param key - The key of the item to check.
    */
    has<Key extends keyof T>(key: Key | string): boolean;
    /**
    Reset items to their default values, as defined by the `defaults` or `schema` option.

    @see `clear()` to reset all items.

    @param keys - The keys of the items to reset.
    */
    reset<Key extends keyof T>(...keys: Key[]): void;
    /**
    Delete an item.

    @param key - The key of the item to delete.
    */
    delete<Key extends keyof T>(key: Key): void;
    /**
    Delete all items.

    This resets known items to their default values, if defined by the `defaults` or `schema` option.
    */
    clear(): void;
    /**
    Watches the given `key`, calling `callback` on any changes.

    @param key - The key wo watch.
    @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
    @returns A function, that when called, will unsubscribe.
    */
    onDidChange<Key extends keyof T>(key: Key, callback: OnDidChangeCallback<T[Key]>): Unsubscribe;
    /**
    Watches the whole config object, calling `callback` on any changes.

    @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
    @returns A function, that when called, will unsubscribe.
    */
    onDidAnyChange(callback: OnDidAnyChangeCallback<T>): Unsubscribe;
    get size(): number;
    get store(): T;
    set store(value: T);
    [Symbol.iterator](): IterableIterator<[keyof T, T[keyof T]]>;
    private _encryptData;
    private _handleChange;
    private readonly _deserialize;
    private readonly _serialize;
    private _validate;
    private _ensureDirectory;
    private _write;
    private _watch;
    private _migrate;
    private _containsReservedKey;
    private _isVersionInRangeFormat;
    private _shouldPerformMigration;
    private _get;
    private _set;
}

interface CachedAppInfo {
    appId: string;
    orgId?: string;
    storeFqdn?: string;
}
interface ConfSchema {
    appInfo: CachedAppInfo[];
}
declare const cliKit: Conf<ConfSchema>;
declare function getAppInfo(appId: string): CachedAppInfo | undefined;
declare function setAppInfo(appId: string, data: {
    storeFqdn?: string;
    orgId?: string;
}): void;

type store_CachedAppInfo = CachedAppInfo;
declare const store_cliKit: typeof cliKit;
declare const store_getAppInfo: typeof getAppInfo;
declare const store_setAppInfo: typeof setAppInfo;
declare namespace store {
  export {
    store_CachedAppInfo as CachedAppInfo,
    store_cliKit as cliKit,
    store_getAppInfo as getAppInfo,
    store_setAppInfo as setAppInfo,
  };
}

declare function request$1<T>(query: any, token: string, store: string, variables?: any): Promise<T>;

declare namespace admin {
  export {
    request$1 as request,
  };
}

declare function request<T>(query: any, token: string, variables?: any): Promise<T>;

declare const partners_request: typeof request;
declare namespace partners {
  export {
    partners_request as request,
  };
}

declare const FindOrganizationQuery: string;
interface FindOrganizationQuerySchema {
    organizations: {
        nodes: {
            id: string;
            businessName: string;
            website: string;
            stores: {
                nodes: {
                    shopId: string;
                    link: string;
                    shopDomain: string;
                    shopName: string;
                    transferDisabled: boolean;
                    convertableToPartnerTest: boolean;
                }[];
            };
            apps: {
                nodes: {
                    id: string;
                    title: string;
                    apiKey: string;
                    apiSecretKeys: {
                        secret: string;
                    }[];
                    appType: string;
                }[];
            };
        }[];
    };
}

interface AllOrganizationsQuerySchema {
    organizations: {
        nodes: {
            id: string;
            businessName: string;
            website: string;
        }[];
    };
}
declare const AllOrganizationsQuery: string;

declare const CreateAppQuery: string;
interface CreateAppQueryVariables {
    org: number;
    title: string;
    appUrl: string;
    redir: string[];
    type: string;
}
interface CreateAppQuerySchema {
    appCreate: {
        app: {
            id: string;
            apiKey: string;
            title: string;
            applicationUrl: string;
            redirectUrlWhitelist: string[];
            apiSecretKeys: {
                secret: string;
            }[];
            appType: string;
        };
        userErrors: {
            field: string[];
            message: string;
        }[];
    };
}

declare const UpdateURLsQuery: string;
interface UpdateURLsQueryVariables {
    apiKey: string;
    appUrl: string;
    redir: string[];
}
interface UpdateURLsQuerySchema {
    appUpdate: {
        userErrors: {
            field: string[];
            message: string;
        }[];
    };
}

declare const index_FindOrganizationQuery: typeof FindOrganizationQuery;
type index_FindOrganizationQuerySchema = FindOrganizationQuerySchema;
type index_AllOrganizationsQuerySchema = AllOrganizationsQuerySchema;
declare const index_AllOrganizationsQuery: typeof AllOrganizationsQuery;
declare const index_CreateAppQuery: typeof CreateAppQuery;
type index_CreateAppQueryVariables = CreateAppQueryVariables;
type index_CreateAppQuerySchema = CreateAppQuerySchema;
declare const index_UpdateURLsQuery: typeof UpdateURLsQuery;
type index_UpdateURLsQueryVariables = UpdateURLsQueryVariables;
type index_UpdateURLsQuerySchema = UpdateURLsQuerySchema;
declare namespace index {
  export {
    index_FindOrganizationQuery as FindOrganizationQuery,
    index_FindOrganizationQuerySchema as FindOrganizationQuerySchema,
    index_AllOrganizationsQuerySchema as AllOrganizationsQuerySchema,
    index_AllOrganizationsQuery as AllOrganizationsQuery,
    index_CreateAppQuery as CreateAppQuery,
    index_CreateAppQueryVariables as CreateAppQueryVariables,
    index_CreateAppQuerySchema as CreateAppQuerySchema,
    index_UpdateURLsQuery as UpdateURLsQuery,
    index_UpdateURLsQueryVariables as UpdateURLsQueryVariables,
    index_UpdateURLsQuerySchema as UpdateURLsQuerySchema,
  };
}

declare const api_admin: typeof admin;
declare const api_partners: typeof partners;
declare namespace api {
  export {
    api_admin as admin,
    api_partners as partners,
    index as graphql,
  };
}

declare const FormData: {
  new (): FormData;
  prototype: FormData;
};

/** @type {typeof globalThis.Blob} */
declare const Blob: typeof globalThis.Blob;

/// <reference lib="dom" />


type AbortSignal = {
	readonly aborted: boolean;

	addEventListener: (type: 'abort', listener: (this: AbortSignal) => void) => void;
	removeEventListener: (type: 'abort', listener: (this: AbortSignal) => void) => void;
};

type HeadersInit = Headers | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>;


/**
 * This Fetch API interface allows you to perform various actions on HTTP request and response headers.
 * These actions include retrieving, setting, adding to, and removing.
 * A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs.
 * You can add to this using methods like append() (see Examples.)
 * In all methods of this interface, header names are matched by case-insensitive byte sequence.
 * */
declare class Headers {
	constructor(init?: HeadersInit);

	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string | null;
	has(name: string): boolean;
	set(name: string, value: string): void;
	forEach(
		callbackfn: (value: string, key: string, parent: Headers) => void,
		thisArg?: any
	): void;

	[Symbol.iterator](): IterableIterator<[string, string]>;
	/**
	 * Returns an iterator allowing to go through all key/value pairs contained in this object.
	 */
	entries(): IterableIterator<[string, string]>;
	/**
	 * Returns an iterator allowing to go through all keys of the key/value pairs contained in this object.
	 */
	keys(): IterableIterator<string>;
	/**
	 * Returns an iterator allowing to go through all values of the key/value pairs contained in this object.
	 */
	values(): IterableIterator<string>;

	/** Node-fetch extension */
	raw(): Record<string, string[]>;
}

interface RequestInit {
	/**
	 * A BodyInit object or null to set request's body.
	 */
	body?: BodyInit | null;
	/**
	 * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
	 */
	headers?: HeadersInit;
	/**
	 * A string to set request's method.
	 */
	method?: string;
	/**
	 * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
	 */
	redirect?: RequestRedirect;
	/**
	 * An AbortSignal to set request's signal.
	 */
	signal?: AbortSignal | null;
	/**
	 * A string whose value is a same-origin URL, "about:client", or the empty string, to set request’s referrer.
	 */
	referrer?: string;
	/**
	 * A referrer policy to set request’s referrerPolicy.
	 */
	referrerPolicy?: ReferrerPolicy;

	// Node-fetch extensions to the whatwg/fetch spec
	agent?: RequestOptions['agent'] | ((parsedUrl: URL) => RequestOptions['agent']);
	compress?: boolean;
	counter?: number;
	follow?: number;
	hostname?: string;
	port?: number;
	protocol?: string;
	size?: number;
	highWaterMark?: number;
	insecureHTTPParser?: boolean;
}

interface ResponseInit {
	headers?: HeadersInit;
	status?: number;
	statusText?: string;
}

type BodyInit =
	| Blob
	| Buffer
	| URLSearchParams
	| FormData
	| NodeJS.ReadableStream
	| string;
declare class BodyMixin {
	constructor(body?: BodyInit, options?: {size?: number});

	readonly body: NodeJS.ReadableStream | null;
	readonly bodyUsed: boolean;
	readonly size: number;

	/** @deprecated Use `body.arrayBuffer()` instead. */
	buffer(): Promise<Buffer>;
	arrayBuffer(): Promise<ArrayBuffer>;
	formData(): Promise<FormData>;
	blob(): Promise<Blob>;
	json(): Promise<unknown>;
	text(): Promise<string>;
}

type RequestRedirect = 'error' | 'follow' | 'manual';
type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
type RequestInfo = string | Request;
declare class Request extends BodyMixin {
	constructor(input: RequestInfo, init?: RequestInit);

	/**
	 * Returns a Headers object consisting of the headers associated with request. Note that headers added in the network layer by the user agent will not be accounted for in this object, e.g., the "Host" header.
	 */
	readonly headers: Headers;
	/**
	 * Returns request's HTTP method, which is "GET" by default.
	 */
	readonly method: string;
	/**
	 * Returns the redirect mode associated with request, which is a string indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.
	 */
	readonly redirect: RequestRedirect;
	/**
	 * Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort event handler.
	 */
	readonly signal: AbortSignal;
	/**
	 * Returns the URL of request as a string.
	 */
	readonly url: string;
	/**
	 * A string whose value is a same-origin URL, "about:client", or the empty string, to set request’s referrer.
	 */
	readonly referrer: string;
	/**
	 * A referrer policy to set request’s referrerPolicy.
	 */
	readonly referrerPolicy: ReferrerPolicy;
	clone(): Request;
}

type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';

declare class Response$1 extends BodyMixin {
	constructor(body?: BodyInit | null, init?: ResponseInit);

	readonly headers: Headers;
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly type: ResponseType;
	readonly url: string;
	clone(): Response$1;

	static error(): Response$1;
	static redirect(url: string, status?: number): Response$1;
}
declare function fetch$1(url: RequestInfo, init?: RequestInit): Promise<Response$1>;

declare type Response = ReturnType<typeof fetch$1>;
/**
 * An interface that abstracts way node-fetch. When Node has built-in
 * support for "fetch" in the standard library, we can drop the node-fetch
 * dependency from here.
 * Note that we are exposing types from "node-fetch". The reason being is that
 * they are consistent with the Web API so if we drop node-fetch in the future
 * it won't require changes from the callers.
 * @param url {RequestInfo} This defines the resource that you wish to fetch.
 * @param init {RequestInit} An object containing any custom settings that you want to apply to the request
 * @returns A promise that resolves with the response.
 */
declare function fetch(url: RequestInfo, init?: RequestInit): Response;

declare const http_fetch: typeof fetch;
declare namespace http {
  export {
    http_fetch as fetch,
  };
}

declare const InvalidChecksumError: ({ file, expected, got }: {
    file: string;
    expected: string;
    got: string;
}) => Abort;
/**
 * Given a local file and a URL pointing to a remote file representing the MD5 of a local file,
 * it validates the authenticity of the binary using an MD5 checksum.
 * @param options: The file to validate and the URL that points to the file containing the MD5.
 */
declare function validateMD5({ file, md5FileURL }: {
    file: string;
    md5FileURL: string;
}): Promise<void>;

declare const checksum_InvalidChecksumError: typeof InvalidChecksumError;
declare const checksum_validateMD5: typeof validateMD5;
declare namespace checksum {
  export {
    checksum_InvalidChecksumError as InvalidChecksumError,
    checksum_validateMD5 as validateMD5,
  };
}

declare const constants: {
    environmentVariables: {
        shopifyConfig: string;
        runAsUser: string;
        partnersEnv: string;
        shopifyEnv: string;
        identityEnv: string;
        spin: string;
        spinInstance: string;
        spinWorkspace: string;
        spinNamespace: string;
        spinHost: string;
        partnersToken: string;
    };
    paths: {
        executables: {
            dev: string;
        };
    };
    /**
     * Versions are resolved at build time by Rollup's JSON plugin.
     */
    versions: {
        cliKit: string;
        /**
         * cli-kit can resolve the version of cli and app at build time because
         * the version of both packages is tied. If it wasn't, wen'd need
         * to resolve the version at build time.
         * Check out the linked configuration in .changeset/config.json
         */
        cli: string;
        app: string;
    };
    keychain: {
        service: string;
    };
    session: {
        expirationTimeMarginInMinutes: number;
    };
};

export { api, checksum, constants, dependency, environment, error$1 as error, file, git, http, os, output$1 as output, path, schema, session, store, string, system, template, toml, tunnel, ui, version };
//# sourceMappingURL=index.d.ts.map
