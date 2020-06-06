import React, { useEffect, useRef, useContext } from 'react';
import { _arrayToHeap, getImageData, StringToCharPtr } from '../../helpers/wasm';
import { WasmContext } from '../../helpers/wasm-ready';

function App() {
  const canvasRef = useRef(null);
  const wasm = useContext(WasmContext);
  useEffect(() => {
    (async function () {
      const imageData = await getImageData('https://cdn141.picsart.com/327941520116201.jpg');
      canvasRef.current.width = imageData.width;
      canvasRef.current.height = imageData.height;
      wasm._createContext(imageData.width, imageData.height, StringToCharPtr('canvas'));
      console.log(imageData);
      const arrayInHeap = _arrayToHeap(imageData.data);

      wasm._loadTexture(arrayInHeap.byteOffset, arrayInHeap.length);
      wasm._debug(0);
    })()
  }, [wasm]);
  return (
    <div >
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
}

export default App;
