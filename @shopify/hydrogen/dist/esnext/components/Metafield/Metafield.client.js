import React from 'react';
import { useShop } from '../../foundation';
import { getMeasurementAsString } from '../../utilities';
import { Image } from '../Image';
/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * When a render function is provided, it passes the Metafield object with a value
 * that was parsed according to the Metafield's `type` field. For more information,
 * refer to the [Render props](#render-props) section.
 *
 * When no render function is provided, it renders a smart default of the
 * Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export function Metafield(props) {
    var _a;
    const { data, children, as, ...passthroughProps } = props;
    const { locale } = useShop();
    if (data.value == null) {
        console.warn(`No metafield value for ${data}`);
        return null;
    }
    switch (data.type) {
        case 'date': {
            const Wrapper = as !== null && as !== void 0 ? as : 'time';
            return (React.createElement(Wrapper, { ...passthroughProps }, data.value.toLocaleDateString(locale)));
        }
        case 'date_time': {
            const Wrapper = as !== null && as !== void 0 ? as : 'time';
            return (React.createElement(Wrapper, { ...passthroughProps }, data.value.toLocaleString(locale)));
        }
        case 'weight':
        case 'dimension':
        case 'volume': {
            const Wrapper = as !== null && as !== void 0 ? as : 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, getMeasurementAsString(data.value, locale)));
        }
        case 'rating': {
            const Wrapper = as !== null && as !== void 0 ? as : 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, data.value.value));
        }
        case 'single_line_text_field': {
            const Wrapper = as !== null && as !== void 0 ? as : 'span';
            return (React.createElement(Wrapper, { ...passthroughProps, dangerouslySetInnerHTML: { __html: data.value } }));
        }
        case 'multi_line_text_field': {
            const Wrapper = as !== null && as !== void 0 ? as : 'div';
            return (React.createElement(Wrapper, { ...passthroughProps, dangerouslySetInnerHTML: {
                    __html: data.value.split('\n').join('<br/>'),
                } }));
        }
        case 'url':
            return (React.createElement("a", { href: data.value, ...passthroughProps }, data.value));
        case 'json':
            const Wrapper = as !== null && as !== void 0 ? as : 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, JSON.stringify(data.value)));
        case 'file_reference': {
            if (((_a = data.reference) === null || _a === void 0 ? void 0 : _a.__typename) === 'MediaImage') {
                const ref = data.reference;
                return ref.image ? (React.createElement(Image, { data: ref.image, ...passthroughProps })) : null;
            }
        }
        default: {
            const Wrapper = as !== null && as !== void 0 ? as : 'span';
            return React.createElement(Wrapper, { ...passthroughProps }, data.value.toString());
        }
    }
}
