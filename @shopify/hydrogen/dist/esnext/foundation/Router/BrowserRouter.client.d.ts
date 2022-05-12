import { BrowserHistory, Location } from 'history';
import React, { FC } from 'react';
declare type RouterContextValue = {
    history: BrowserHistory;
    location: Location;
};
export declare const RouterContext: React.Context<{} | RouterContextValue>;
export declare const BrowserRouter: FC<{
    history?: BrowserHistory;
}>;
export declare function useRouter(): RouterContextValue;
export declare function useLocation(): Location;
export {};
