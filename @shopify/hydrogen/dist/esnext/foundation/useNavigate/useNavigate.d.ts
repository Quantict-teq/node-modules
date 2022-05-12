declare type NavigationOptions = {
    /** Whether to update the state object or URL of the current history entry. Defaults to false. */
    replace?: boolean;
    /** Whether to reload the whole document on navigation. */
    reloadDocument?: boolean;
    /** The custom client state with the navigation. */
    clientState?: any;
};
/**
 * The useNavigate hook imperatively navigates between routes.
 */
export declare function useNavigate(): (path: string, options?: NavigationOptions) => void;
export {};
