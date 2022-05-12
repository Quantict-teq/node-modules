import React from 'react';
import { shopifyImageLoader, getShopifyImageDimensions, } from '../../utilities';
/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
 */
export function Image(props) {
    var _a, _b, _c, _d;
    const { data, options, src, id, alt, width, height, loader, loaderOptions, ...passthroughProps } = props;
    if (!data && !src) {
        throw new Error('Image component: requires either an `data` or `src` prop.');
    }
    if (!data && src && (!width || !height)) {
        throw new Error(`Image component: when 'src' is provided, 'width' and 'height' are required and needs to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`);
    }
    const imgProps = data
        ? convertShopifyImageData({
            data,
            options,
            loader,
            loaderOptions,
            id,
            alt,
        })
        : {
            src,
            id,
            alt,
            width,
            height,
            loader,
            loaderOptions: { width, height, ...loaderOptions },
        };
    const srcPath = imgProps.loader
        ? imgProps.loader({ src: imgProps.src, options: imgProps.loaderOptions })
        : imgProps.src;
    return (React.createElement("img", { id: (_a = imgProps.id) !== null && _a !== void 0 ? _a : '', loading: "lazy", alt: (_b = imgProps.alt) !== null && _b !== void 0 ? _b : '', ...passthroughProps, src: srcPath, width: (_c = imgProps.width) !== null && _c !== void 0 ? _c : undefined, height: (_d = imgProps.height) !== null && _d !== void 0 ? _d : undefined }));
}
function convertShopifyImageData({ data, options, loader, loaderOptions, id: propId, alt, }) {
    const { url: src, altText, id } = data;
    if (!src) {
        throw new Error(`<Image/> requires 'data.url' when using the 'data' prop`);
    }
    const { width, height } = getShopifyImageDimensions(data, options);
    return {
        src,
        id: propId ? propId : id,
        alt: alt ? alt : altText,
        width,
        height,
        loader: loader ? loader : shopifyImageLoader,
        loaderOptions: { ...options, ...loaderOptions },
    };
}
