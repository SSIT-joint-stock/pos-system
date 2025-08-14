'use client';

import React, { createContext, useContext } from "react"

export interface AppProviderContextType {}
export const AppProviderContext = createContext<AppProviderContextType>({});

export const useAppProvider = () => {
    const context = useContext(AppProviderContext);
    if (!context) {
        throw new Error('useAppProvider must be used within an AppProvider');
    }
    return context;
}

export interface AppProviderProps {
    children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    return (
        <AppProviderContext.Provider value={{}}>
            {children}
        </AppProviderContext.Provider>
    )
}