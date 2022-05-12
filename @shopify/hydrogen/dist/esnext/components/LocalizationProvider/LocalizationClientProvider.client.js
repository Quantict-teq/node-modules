import React, { useMemo, useState, useCallback } from 'react';
import { LocalizationContext } from './LocalizationContext.client';
import { useServerProps } from '../../foundation/useServerProps';
export default function LocalizationClientProvider({ localization, children, }) {
    const { setServerProps } = useServerProps();
    const [country, setCountry] = useState(localization.country);
    const setter = useCallback((country) => {
        setCountry(country);
        setServerProps('country', country);
    }, [setServerProps]);
    const contextValue = useMemo(() => {
        return {
            country,
            setCountry: setter,
        };
    }, [country, setter]);
    return (React.createElement(LocalizationContext.Provider, { value: contextValue }, children));
}
