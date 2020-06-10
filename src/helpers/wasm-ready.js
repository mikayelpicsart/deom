import React, { createContext } from 'react';
import { initializeLibrary } from '../wasm/pi_helper';

export const WasmContext = createContext(null);

export function ReadyWasm({ children }) {
    const wasm = useOnRuntimeInitializedReady();
    return (
        <WasmContext.Provider value={wasm}>
            {children}
        </WasmContext.Provider>
    );
}

const onRuntimeInitialized = { status: 'not-init', promise: null, module: null };

function useOnRuntimeInitializedReady() {
    if (onRuntimeInitialized.status === 'resolve') {
        return onRuntimeInitialized.module;
    }
    if (onRuntimeInitialized.status === 'pending') {
        throw onRuntimeInitialized.promise;
    }
    if (onRuntimeInitialized.status === 'not-init') {
        throw onRuntimeInitialized.promise = initializeLibrary().then(wasm => {
            onRuntimeInitialized.module = wasm;
            onRuntimeInitialized.status = 'resolve';
        })
    }
}

export function getWasm() { return onRuntimeInitialized.module; };