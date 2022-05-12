import React, { useState, useEffect, useCallback, } from 'react';
import { useLoadScript } from '../../hooks/useLoadScript/useLoadScript';
/**
 * The `ModelViewer` component renders a 3D model (with the `model-viewer` tag) for
 * the Storefront API's [Model3d object](https://shopify.dev/api/storefront/reference/products/model3d).
 */
export function ModelViewer(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [modelViewer, setModelViewer] = useState(undefined);
    const callbackRef = useCallback((node) => {
        setModelViewer(node);
    }, []);
    const { data, id = data.id, children, className, ...passthroughProps } = props;
    const modelViewerLoadedStatus = useLoadScript('https://unpkg.com/@google/model-viewer@v1.8.0/dist/model-viewer.min.js', {
        module: true,
    });
    useEffect(() => {
        if (modelViewer == null) {
            return;
        }
        if (passthroughProps.onError)
            modelViewer.addEventListener('error', passthroughProps.onError);
        if (passthroughProps.onLoad)
            modelViewer.addEventListener('load', passthroughProps.onLoad);
        if (passthroughProps.onPreload)
            modelViewer.addEventListener('preload', passthroughProps.onPreload);
        if (passthroughProps.onModelVisibility)
            modelViewer.addEventListener('model-visibility', passthroughProps.onModelVisibility);
        if (passthroughProps.onProgress)
            modelViewer.addEventListener('progress', passthroughProps.onProgress);
        if (passthroughProps.onArStatus)
            modelViewer.addEventListener('ar-status', passthroughProps.onArStatus);
        if (passthroughProps.onArTracking)
            modelViewer.addEventListener('ar-tracking', passthroughProps.onArTracking);
        if (passthroughProps.onQuickLookButtonTapped)
            modelViewer.addEventListener('quick-look-button-tapped', passthroughProps.onQuickLookButtonTapped);
        if (passthroughProps.onCameraChange)
            modelViewer.addEventListener('camera-change', passthroughProps.onCameraChange);
        if (passthroughProps.onEnvironmentChange)
            modelViewer.addEventListener('environment-change', passthroughProps.onEnvironmentChange);
        if (passthroughProps.onPlay)
            modelViewer.addEventListener('play', passthroughProps.onPlay);
        if (passthroughProps.onPause)
            modelViewer.addEventListener('ar-status', passthroughProps.onPause);
        if (passthroughProps.onSceneGraphReady)
            modelViewer.addEventListener('scene-graph-ready', passthroughProps.onSceneGraphReady);
        return () => {
            if (modelViewer == null) {
                return;
            }
            if (passthroughProps.onError)
                modelViewer.removeEventListener('error', passthroughProps.onError);
            if (passthroughProps.onLoad)
                modelViewer.removeEventListener('load', passthroughProps.onLoad);
            if (passthroughProps.onPreload)
                modelViewer.removeEventListener('preload', passthroughProps.onPreload);
            if (passthroughProps.onModelVisibility)
                modelViewer.removeEventListener('model-visibility', passthroughProps.onModelVisibility);
            if (passthroughProps.onProgress)
                modelViewer.removeEventListener('progress', passthroughProps.onProgress);
            if (passthroughProps.onArStatus)
                modelViewer.removeEventListener('ar-status', passthroughProps.onArStatus);
            if (passthroughProps.onArTracking)
                modelViewer.removeEventListener('ar-tracking', passthroughProps.onArTracking);
            if (passthroughProps.onQuickLookButtonTapped)
                modelViewer.removeEventListener('quick-look-button-tapped', passthroughProps.onQuickLookButtonTapped);
            if (passthroughProps.onCameraChange)
                modelViewer.removeEventListener('camera-change', passthroughProps.onCameraChange);
            if (passthroughProps.onEnvironmentChange)
                modelViewer.removeEventListener('environment-change', passthroughProps.onEnvironmentChange);
            if (passthroughProps.onPlay)
                modelViewer.removeEventListener('play', passthroughProps.onPlay);
            if (passthroughProps.onPause)
                modelViewer.removeEventListener('ar-status', passthroughProps.onPause);
            if (passthroughProps.onSceneGraphReady)
                modelViewer.removeEventListener('scene-graph-ready', passthroughProps.onSceneGraphReady);
        };
    }, [
        modelViewer,
        passthroughProps.onArStatus,
        passthroughProps.onArTracking,
        passthroughProps.onCameraChange,
        passthroughProps.onEnvironmentChange,
        passthroughProps.onError,
        passthroughProps.onLoad,
        passthroughProps.onModelVisibility,
        passthroughProps.onPause,
        passthroughProps.onPlay,
        passthroughProps.onPreload,
        passthroughProps.onProgress,
        passthroughProps.onQuickLookButtonTapped,
        passthroughProps.onSceneGraphReady,
    ]);
    if (modelViewerLoadedStatus !== 'done') {
        // TODO: What do we want to display while the model-viewer library loads?
        return null;
    }
    if (!((_b = (_a = data.sources) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url)) {
        throw new Error(`<ModelViewer/> requires 'data.sources' prop to be an array, with an object that has a property 'url' on it`);
    }
    if (!data.alt) {
        console.warn(`<ModelViewer/> requires the 'data.alt' prop for accessibility`);
    }
    return (React.createElement("model-viewer", { ref: callbackRef, ...passthroughProps, class: className, id: id, src: data.sources[0].url, alt: data.alt, "camera-controls": (_c = passthroughProps.cameraControls) !== null && _c !== void 0 ? _c : true, poster: passthroughProps.poster || ((_d = data.previewImage) === null || _d === void 0 ? void 0 : _d.url), autoplay: (_e = passthroughProps.autoplay) !== null && _e !== void 0 ? _e : true, loading: passthroughProps.loading, reveal: passthroughProps.reveal, ar: passthroughProps.ar, "ar-modes": passthroughProps.arModes, "ar-scale": passthroughProps.arScale, "ar-placement": passthroughProps.arPlacement, "ios-src": passthroughProps.iosSrc, "touch-action": passthroughProps.touchAction, "disable-zoom": passthroughProps.disableZoom, "orbit-sensitivity": passthroughProps.orbitSensitivity, "auto-rotate": passthroughProps.autoRotate, "auto-rotate-delay": passthroughProps.autoRotateDelay, "rotation-per-second": passthroughProps.rotationPerSecond, "interaction-policy": passthroughProps.interactionPolicy, "interaction-prompt": passthroughProps.interactionPrompt, "interaction-prompt-style": passthroughProps.interactionPromptStyle, "interaction-prompt-threshold": passthroughProps.interactionPromptThreshold, "camera-orbit": passthroughProps.cameraOrbit, "camera-target": passthroughProps.cameraTarget, "field-of-view": passthroughProps.fieldOfView, "max-camera-orbit": passthroughProps.maxCameraOrbit, "min-camera-orbit": passthroughProps.minCameraOrbit, "max-field-of-view": passthroughProps.maxFieldOfView, "min-field-of-view": passthroughProps.minFieldOfView, bounds: passthroughProps.bounds, "interpolation-decay": (_f = passthroughProps.interpolationDecay) !== null && _f !== void 0 ? _f : 100, "skybox-image": passthroughProps.skyboxImage, "environment-image": passthroughProps.environmentImage, exposure: passthroughProps.exposure, "shadow-intensity": (_g = passthroughProps.shadowIntensity) !== null && _g !== void 0 ? _g : 0, "shadow-softness": (_h = passthroughProps.shadowSoftness) !== null && _h !== void 0 ? _h : 0, "animation-name": passthroughProps.animationName, "animation-crossfade-duration": passthroughProps.animationCrossfadeDuration, "variant-name": passthroughProps.variantName, orientation: passthroughProps.orientation, scale: passthroughProps.scale }, children));
}
