import React from 'react';
import { ImageSizeOptions, ImageLoaderOptions } from '../../utilities';
import type { Image as ImageType } from '../../storefront-api-types';
import type { PartialDeep, Merge, MergeExclusive } from 'type-fest';
export interface BaseImageProps {
    /** A custom function that generates the image URL. Parameters passed into this function includes
     * `src` and an `options` object that contains the provided `width`, `height` and `loaderOptions` values.
     */
    loader?(props: ImageLoaderOptions): string;
    /** An object of `loader` function options. For example, if the `loader` function requires a `scale` option,
     * then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`).
     */
    loaderOptions?: ImageLoaderOptions['options'];
}
interface MediaImagePropsBase extends BaseImageProps {
    /** An object with fields that correspond to the Storefront API's
     * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
     */
    data: PartialDeep<ImageType>;
    /** An object of image size options for Shopify CDN images. */
    options?: ImageSizeOptions;
}
interface ExternalImagePropsBase extends BaseImageProps {
    /** A URL string. This string can be an absolute path or a relative path depending on the `loader`. */
    src: string;
    /** The integer value for the width of the image. This is a required prop when `src` is present. */
    width: number;
    /** The integer value for the height of the image. This is a required prop when `src` is present. */
    height: number;
}
declare type BaseElementProps = React.ImgHTMLAttributes<HTMLImageElement>;
declare type MediaImageProps = Merge<BaseElementProps, MediaImagePropsBase>;
declare type ExternalImageProps = Merge<BaseElementProps, ExternalImagePropsBase>;
declare type ImageProps = MergeExclusive<MediaImageProps, ExternalImageProps>;
/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
 */
export declare function Image(props: ImageProps): JSX.Element;
export {};
