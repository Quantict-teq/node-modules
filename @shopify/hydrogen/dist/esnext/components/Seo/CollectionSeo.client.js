import React from 'react';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
import { ImageSeo } from './ImageSeo.client';
export function CollectionSeo({ title, description, seo, image, }) {
    var _a, _b;
    const seoTitle = (_a = seo === null || seo === void 0 ? void 0 : seo.title) !== null && _a !== void 0 ? _a : title;
    const seoDescription = (_b = seo === null || seo === void 0 ? void 0 : seo.description) !== null && _b !== void 0 ? _b : description;
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription }),
        image && React.createElement(ImageSeo, { ...image })));
}
