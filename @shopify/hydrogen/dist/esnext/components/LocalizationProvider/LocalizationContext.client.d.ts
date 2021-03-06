import type { LocalizationQuery } from './LocalizationProvider.server';
export declare type Localization = LocalizationQuery['localization'];
export interface LocalizationContextValue {
    country?: Localization['country'];
    setCountry(country: Localization['country']): void;
}
export declare const LocalizationContext: import("react").Context<LocalizationContextValue | null>;
