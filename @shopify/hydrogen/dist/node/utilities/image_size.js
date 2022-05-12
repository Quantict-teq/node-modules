"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopifyImageDimensions = exports.useImageUrl = exports.shopifyImageLoader = exports.addImageSizeParametersToUrl = void 0;
const React = __importStar(require("react"));
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
function addImageSizeParametersToUrl(url, { width, height, crop, scale, format }) {
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
exports.addImageSizeParametersToUrl = addImageSizeParametersToUrl;
function shopifyImageLoader({ src, options }) {
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
exports.shopifyImageLoader = shopifyImageLoader;
function useImageUrl(src, options) {
    return React.useMemo(() => {
        return src ? shopifyImageLoader({ src, options }) : src;
    }, [options, src]);
}
exports.useImageUrl = useImageUrl;
function getShopifyImageDimensions(image, options) {
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
exports.getShopifyImageDimensions = getShopifyImageDimensions;
