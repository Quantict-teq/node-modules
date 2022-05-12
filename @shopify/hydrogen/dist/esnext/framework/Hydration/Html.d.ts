import { ReactNode } from 'react';
import type { HelmetData as HeadData } from 'react-helmet-async';
declare type HtmlOptions = {
    children: ReactNode;
    template: string;
    htmlAttrs?: Record<string, string>;
    bodyAttrs?: Record<string, string>;
};
export declare function Html({ children, template, htmlAttrs, bodyAttrs }: HtmlOptions): JSX.Element;
export declare function applyHtmlHead(html: string, head: HeadData, template: string): string;
export {};
