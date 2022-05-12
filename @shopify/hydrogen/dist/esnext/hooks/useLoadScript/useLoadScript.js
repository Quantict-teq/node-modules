import { loadScript } from '../../utilities/load_script';
import { useState, useEffect } from 'react';
/**
 * The `useLoadScript` hook loads an external script tag on the client-side.
 */
export function useLoadScript(url, options) {
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        async function loadScriptWrapper() {
            try {
                setStatus('loading');
                await loadScript(url, options);
                setStatus('done');
            }
            catch (error) {
                setStatus('error');
            }
        }
        loadScriptWrapper();
    }, [url, JSON.stringify(options)]);
    return status;
}
