import React, { createContext, ReactNode } from 'react';
import WASM from '../wasm/demo';
import { wrapper } from '../wasm/wrraper';

export const WasmContext = createContext<any>(null);

export function ReadyWasm({ children }: { children: ReactNode }) {
    const wasm = useOnRuntimeInitializedReady();
    return (
        <WasmContext.Provider value={wasm}>
            {children}
        </WasmContext.Provider>
    );
}
export interface IModule {
    classes: { [key: string]: any; },
    wasm: EmscriptenModule
};
interface IPromiseCache {
    status: 'not-init' | 'pending' | 'resolve',
    promise: Promise<any> | null,
    module: IModule
};
// @ts-ignore
const onRuntimeInitialized: IPromiseCache = { status: 'not-init', promise: null, module: { classes: {}, wasm: {} }  } ;

function useOnRuntimeInitializedReady() {
    if (onRuntimeInitialized.status === 'resolve') {
        return onRuntimeInitialized.module;
    }
    if (onRuntimeInitialized.status === 'pending') {
        throw onRuntimeInitialized.promise;
    }
    if (onRuntimeInitialized.status === 'not-init') {
        throw onRuntimeInitialized.promise = WASM().then((wasm: EmscriptenModule) => {
            try {
                onRuntimeInitialized.module = { classes: wrapper(wasm), wasm };
                onRuntimeInitialized.status = 'resolve';
            } catch (error) {
                console.log(error);
            }
            
        })
    }
}

export function getWasm() { return onRuntimeInitialized.module; };