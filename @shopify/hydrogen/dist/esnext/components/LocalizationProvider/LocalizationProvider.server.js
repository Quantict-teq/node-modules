import React from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client';
import { useShop } from '../../foundation/useShop';
import { useShopQuery } from '../../hooks/useShopQuery';
import { CacheDays } from '../../framework/CachingStrategy';
/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](https://shopify.dev/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useCountry` hook.
 * The `isoCode` of the `country` can be used in the Storefront API's
 * `@inContext` directive as the `country` value.
 */
export function LocalizationProvider(props) {
    const { languageCode } = useShop();
    const { data: { localization }, } = useShopQuery({
        query: query,
        variables: { language: languageCode },
        cache: CacheDays(),
        preload: props.preload,
    });
    return (React.createElement(LocalizationClientProvider, { localization: localization }, props.children));
}
const query = `
query Localization($language: LanguageCode)
@inContext(language: $language) {
   localization {
    country {
      isoCode
      name
      currency {
        isoCode
      }
    }
  }
}
`;
