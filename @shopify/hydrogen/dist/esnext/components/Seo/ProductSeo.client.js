import React from 'react';
import { Head } from '../../client';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
import { ImageSeo } from './ImageSeo.client';
export function ProductSeo({ url, title, description, seo, vendor, featuredImage, variants, }) {
    var _a, _b, _c;
    const seoTitle = (_a = seo === null || seo === void 0 ? void 0 : seo.title) !== null && _a !== void 0 ? _a : title;
    const seoDescription = (_b = seo === null || seo === void 0 ? void 0 : seo.description) !== null && _b !== void 0 ? _b : description;
    let firstVariantPrice;
    const productSchema = {
        '@context': 'http://schema.org/',
        '@type': 'Product',
        name: title,
        description,
        brand: {
            '@type': 'Thing',
            name: vendor,
        },
        url,
    };
    if (featuredImage) {
        productSchema.image = featuredImage.url;
    }
    if ((variants === null || variants === void 0 ? void 0 : variants.edges) && variants.edges.length > 0) {
        const firstVariant = (_c = variants.edges[0]) === null || _c === void 0 ? void 0 : _c.node;
        firstVariantPrice = firstVariant === null || firstVariant === void 0 ? void 0 : firstVariant.priceV2;
        if (firstVariant && firstVariant.sku) {
            productSchema.sku = firstVariant.sku;
        }
        productSchema.offers = variants.edges.map((edge) => {
            var _a;
            const node = edge === null || edge === void 0 ? void 0 : edge.node;
            if (!node || !((_a = node.priceV2) === null || _a === void 0 ? void 0 : _a.amount) || !node.priceV2.currencyCode) {
                throw new Error(`<ProductSeo/> requires variant.PriceV2 'amount' and 'currency`);
            }
            const offerSchema = {
                '@type': 'Offer',
                availability: `https://schema.org/${node.availableForSale ? 'InStock' : 'OutOfStock'}`,
                price: node.priceV2.amount,
                priceCurrency: node.priceV2.currencyCode,
            };
            if (node.sku) {
                offerSchema.sku = node.sku;
            }
            if (node.image && node.image.url) {
                offerSchema.image = node.image.url;
            }
            return offerSchema;
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Head, null,
            React.createElement("meta", { property: "og:type", content: "og:product" }),
            firstVariantPrice && (React.createElement("meta", { property: "og:price:amount", content: `${firstVariantPrice.amount}` })),
            firstVariantPrice && (React.createElement("meta", { property: "og:price:currency", content: firstVariantPrice.currencyCode })),
            React.createElement("script", { type: "application/ld+json" }, JSON.stringify(productSchema))),
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription }),
        featuredImage && React.createElement(ImageSeo, { ...featuredImage })));
}
