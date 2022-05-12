import React from 'react';
import { useImageUrl } from '../../utilities';
/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).
 */
export function Video(props) {
    var _a;
    const { data, options, id = data.id, playsInline = true, controls = true, ...passthroughProps } = props;
    const posterUrl = useImageUrl((_a = data.previewImage) === null || _a === void 0 ? void 0 : _a.url, options);
    if (!data.sources) {
        throw new Error(`<Video/> requires a 'data.sources' array`);
    }
    return (React.createElement("video", { ...passthroughProps, id: id, playsInline: playsInline, controls: controls, poster: posterUrl }, data.sources.map((source) => {
        if (!((source === null || source === void 0 ? void 0 : source.url) && (source === null || source === void 0 ? void 0 : source.mimeType))) {
            throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
        }
        return (React.createElement("source", { key: source.url, src: source.url, type: source.mimeType }));
    })));
}
