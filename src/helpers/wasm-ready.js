import WASM from '../wasm/demo';

console.log(WASM(), WASM);

const onRuntimeInitialized = { status: 'not-init', promise: null } ;
export function useOnRuntimeInitializedReady () {
    if(onRuntimeInitialized.status === 'resolve') {
        return true;
    }
    if(onRuntimeInitialized.status === 'pending') {
        throw onRuntimeInitialized.promise;
    }
    if(onRuntimeInitialized.status === 'not-init') {
        throw onRuntimeInitialized.promise = WASM();
    }
}