import { getWasm } from './wasm-ready';

export function _arrayToHeap(typedArray: Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray ) {
    const numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    const ptr = getWasm().wasm?._malloc(numBytes);
    const heapBytes = getWasm().wasm?.HEAPU8.subarray(ptr, ptr + numBytes);
    heapBytes.set(typedArray);
    return heapBytes;
}

export function StringToCharPtr(str: string) {
    const encoder = new TextEncoder()
    const view = encoder.encode(str + '\0');
    return _arrayToHeap(view).byteOffset;
}

export function getImageData(url: string): Promise<ImageData> {
    const canvas2d = document.createElement('canvas');
    const ctx = canvas2d.getContext('2d');
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = function () {
            canvas2d.width = image.naturalWidth;
            canvas2d.height = image.naturalHeight;
            ctx?.drawImage(image, 0, 0);
            resolve(ctx?.getImageData(0, 0, canvas2d.width, canvas2d.height));
        };
        image.onerror = reject;
        image.onabort = reject;
        image.setAttribute('crossOrigin', '');
        image.src = url;
    })
}