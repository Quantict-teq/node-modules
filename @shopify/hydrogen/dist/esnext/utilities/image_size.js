import * as React from 'react';
// TODO: Are there other CDNs missing from here?
const PRODUCTION_CDN_HOSTNAMES = [
    'cdn.shopify.com',
    'cdn.shopifycdn.net',
    'shopify-assets.shopifycdn.com',
    'shopify-assets.shopifycdn.net',
];
const LOCAL_CDN_HOSTNAMES = ['spin.dev'];
/**
 * Adds image size parameters to an image URL hosted by Shopify's CDN
 */
export function addImageSizeParametersToUrl(url, { width, height, crop, scale, format }) {
    const newUrl = new URL(url);
    const sizePath = width || height ? `_${width !== null && width !== void 0 ? width : ''}x${height !== null && height !== void 0 ? height : ''}` : '';
    const cropPath = crop ? `_crop_${crop}` : '';
    const scalePath = scale ? `@${scale}x` : '';
    const progressive = format === 'pjpg' ? `.progressive` : '';
    const asJPG = format === 'jpg' ? `.jpg` : '';
    // We assume here that the last `.` is the delimiter
    // between the file name and the file type
    const fileDelimiterIndex = newUrl.pathname.lastIndexOf('.');
    const fileName = newUrl.pathname.substr(0, fileDelimiterIndex);
    const fileType = newUrl.pathname.substr(fileDelimiterIndex);
    newUrl.pathname = `${fileName}${sizePath}${cropPath}${scalePath}${progressive}${fileType}${asJPG}`;
    return newUrl.toString();
}
export function shopifyImageLoader({ src, options }) {
    const newSrc = new URL(src);
    const allowedCDNHostnames = PRODUCTION_CDN_HOSTNAMES.concat(LOCAL_CDN_HOSTNAMES);
    const isShopifyServedImage = allowedCDNHostnames.some((allowedHostname) => newSrc.hostname.endsWith(allowedHostname));
    if (!isShopifyServedImage ||
        options == null ||
        (!options.width &&
            !options.height &&
            !options.crop &&
            !options.scale &&
            !options.format)) {
        return src;
    }
    return addImageSizeParametersToUrl(src, options);
}
export function useImageUrl(src, options) {
    return React.useMemo(() => {
        return src ? shopifyImageLoader({ src, options }) : src;
    }, [options, src]);
}
export function getShopifyImageDimensions(image, options) {
    // Storefront API could return null dimension values for images that are not hosted on Shopify CDN
    // The API dimensions references the image's intrinstic/natural dimensions and provides image aspect ratio information
    const apiWidth = image.width;
    const apiHeight = image.height;
    if (apiWidth && apiHeight && ((options === null || options === void 0 ? void 0 : options.width) || (options === null || options === void 0 ? void 0 : options.height))) {
        const optionWidth = (options === null || options === void 0 ? void 0 : options.width)
            ? parseInt(options.width, 10)
            : undefined;
        const optionHeight = (options === null || options === void 0 ? void 0 : options.height)
            ? parseInt(options.height, 10)
            : undefined;
        // Use option defined width & height
        if (optionWidth && optionHeight) {
            return { width: optionWidth, height: optionHeight };
        }
        // Calculate width from aspect ratio
        if (!optionWidth && optionHeight) {
            return {
                width: Math.round((apiWidth / apiHeight) * optionHeight),
                height: optionHeight,
            };
        }
        // Calculate height from aspect ratio
        if (optionWidth && !optionHeight) {
            return {
                width: optionWidth,
                height: Math.round((apiHeight / apiWidth) * optionWidth),
            };
        }
    }
    return { width: apiWidth, height: apiHeight };
}
