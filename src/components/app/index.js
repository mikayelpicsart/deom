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
      const arrayInHeap = _arrayToHeap(imageData.data);
      wasm._loadTexture(arrayInHeap.byteOffset, arrayInHeap.length);
      wasm._debug(0);
    })()
  }, [wasm]);

  useEffect(() => {
    var instance = new wasm.MyClass(10, "hello");
    instance.incrementX();
    console.log(instance.x); // 11
    instance.x = 20; // 20
    console.log(wasm.MyClass.getStringFromInstance(instance)); // "hello"
    instance.delete();
  }, [wasm]);
  return (
    <div >
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
}

export default App;
