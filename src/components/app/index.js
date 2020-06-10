import React, { useEffect, useRef, useContext } from 'react';
import { _arrayToHeap, getImageData, StringToCharPtr } from '../../helpers/wasm';
import { WasmContext } from '../../helpers/wasm-ready';

function App() {
  const canvasRef = useRef(null);
  const pi = useContext(WasmContext);
  console.log(pi);
  useEffect(() => {
    const s = new pi.CPUSession(50);
    s.accessGraph(() => {
        const i1 = pi.Int(5);
        const i2 = pi.Int(6);
        const i3 = pi.Int(2);
        const add = pi.Add(i1, i2);
        const sub = pi.Sub(add, {y: i3, device: pi.Device.CPU});
        const r = pi.Int(sub);
        s.runValue(r);
        console.log(r.value);
    });
    // (async function () {
    //   const imageData = await getImageData('https://cdn141.picsart.com/327941520116201.jpg');
    //   canvasRef.current.width = imageData.width;
    //   canvasRef.current.height = imageData.height;
    //   wasm._createContext(imageData.width, imageData.height, StringToCharPtr('canvas'));
    //   const arrayInHeap = _arrayToHeap(imageData.data);
    //   wasm._loadTexture(arrayInHeap.byteOffset, arrayInHeap.length);
    //   // wasm._debug(0);
    // })()
  }, [pi]);
  return (
    <div >
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
}

export default App;
