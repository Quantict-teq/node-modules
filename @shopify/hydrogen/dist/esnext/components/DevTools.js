import React, { useEffect, useState, useCallback } from 'react';
export default function DevTools() {
    const [warnings, setWarnings] = useState(null);
    const [open, setOpen] = useState(false);
    const [activePanel, setActivePanel] = useState('warnings');
    const toggleOpen = useCallback(() => setOpen((state) => !state), []);
    const [hasMounted, setHasMounted] = React.useState(false);
    useEffect(() => {
        setHasMounted(true);
        if (import.meta.hot) {
            import.meta.hot.on('hydrogen', ({ type, data }) => {
                if (type === 'warn') {
                    setWarnings((state) => [...(state || []), data]);
                }
            });
        }
    }, []);
    const perfData = performance.getEntriesByType('navigation');
    const entry = perfData[0];
    let activePanelContent = null;
    switch (activePanel) {
        case 'warnings':
            const warningsMarkup = warnings
                ? warnings.map((war, i) => React.createElement("li", { key: war + i }, war))
                : null;
            activePanelContent = (React.createElement(React.Fragment, null,
                React.createElement(PanelHeading, null, "Overfetched graphQL fields"),
                React.createElement("ul", { style: {
                        fontFamily: 'monospace',
                        paddingTop: '1em',
                        fontSize: '0.9em',
                    } }, warningsMarkup)));
            break;
        case 'network':
            activePanelContent = (React.createElement(React.Fragment, null,
                React.createElement(PanelHeading, null, "Metrics"),
                React.createElement("ul", { style: {
                        fontFamily: 'monospace',
                        paddingTop: '1em',
                        fontSize: '0.9em',
                    } }, Object.entries(entry.toJSON())
                    .filter(([key]) => ['duration', 'domInteractive'].includes(key))
                    .map(([key, value]) => (React.createElement("li", { key: key },
                    React.createElement("strong", null, key),
                    " ",
                    (value / 1000).toFixed(2),
                    "s"))))));
            break;
    }
    const buttonText = (React.createElement("svg", { style: {
            height: '3em',
            width: '3em',
        }, width: "131", height: "130", viewBox: "0 0 131 130", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M64.9548 106.281L27.1377 86.1894L40.0714 79.3723L54.6329 87.1049L66.851 80.6638L52.2895 72.9313L65.2231 66.0979L103.04 86.1894L90.1065 93.0064L76.35 85.6989L64.114 92.1563L77.8884 99.4638L64.9548 106.281Z", fill: "white" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M65.2247 25L105.178 46.2267L90.105 54.1716L76.3488 46.8642L66.2525 52.1924L80.028 59.5005L64.9532 67.446L25 46.2196L40.0734 38.2748L54.6349 46.0073L64.713 40.6944L50.1533 32.9628L65.2247 25ZM54.4262 32.9673L68.9896 40.7008L54.6315 48.27L40.0699 40.5374L29.276 46.2267L64.9569 65.1833L75.7495 59.4947L61.9761 52.1878L76.3518 44.6012L90.1087 51.9088L100.902 46.2196L65.2221 27.2634L54.4262 32.9673Z", fill: "white" })));
    if (import.meta.env.DEV && hasMounted) {
        return (React.createElement("div", { style: {
                position: 'fixed',
                right: open ? 0 : '2em',
                left: open ? 0 : '2em',
                bottom: open ? 0 : '-2em',
                borderRadius: open ? 0 : '2em',
                top: '100%',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                height: open ? '75%' : '4em',
                transform: open ? 'translateY(-100%)' : 'translateY(-5em)',
            } },
            React.createElement("button", { style: {
                    position: 'absolute',
                    top: '0.35em',
                    right: '1em',
                    overflow: 'hidden',
                    zIndex: 10,
                }, onClick: toggleOpen }, buttonText),
            React.createElement("div", { style: {
                    overflow: 'scroll',
                    color: 'white',
                    height: '100%',
                    padding: '2em',
                    background: 'rgba(0, 0, 0, 0.95)',
                    borderRadius: open ? 0 : '2em',
                } },
                React.createElement("div", { style: {
                        position: 'absolute',
                        padding: '1.2em 2em',
                        top: 0,
                        left: '-0.5em',
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.95)',
                        borderRadius: open ? 0 : '2em',
                        display: 'flex',
                        alignItems: 'center',
                    } },
                    warnings && warnings.length > 0 && (React.createElement("button", { onClick: () => {
                            setOpen(true);
                            setActivePanel('warnings');
                        }, style: {
                            margin: '0 0.5em',
                            textDecoration: open && activePanel === 'warnings' ? 'underline' : 'none',
                        } },
                        "Warnings",
                        ' ',
                        warnings && (React.createElement("strong", { style: {
                                borderRadius: '2em',
                                padding: '.25em 0.5em',
                                background: 'white',
                                margin: '0 0.25em',
                                color: 'black',
                                textAlign: 'center',
                            } }, warnings.length)))),
                    React.createElement("button", { onClick: () => {
                            setOpen(true);
                            setActivePanel('network');
                        }, disabled: activePanel === 'network', style: {
                            margin: '0 0.5em',
                            textDecoration: open && activePanel === 'network' ? 'underline' : 'none',
                        } }, "Network")),
                React.createElement("div", { style: { paddingTop: '2em' } }, activePanelContent))));
    }
    return null;
}
const PanelHeading = ({ children }) => (React.createElement("h1", { style: {
        paddingTop: '1em',
        fontWeight: 'bold',
    } }, children));
