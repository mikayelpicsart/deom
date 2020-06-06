import React, { createContext } from 'react';
import WASM from '../wasm/demo';

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
        throw onRuntimeInitialized.promise = WASM().then(_ => {
            onRuntimeInitialized.module = _;
            onRuntimeInitialized.status = 'resolve';
        })
    }
}

export function getWasm() { return onRuntimeInitialized.module; };