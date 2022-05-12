import React from 'react';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
export function PageSeo({ title, seo }) {
    var _a;
    const seoTitle = (_a = seo === null || seo === void 0 ? void 0 : seo.title) !== null && _a !== void 0 ? _a : title;
    const seoDescription = seo === null || seo === void 0 ? void 0 : seo.description;
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription })));
}
