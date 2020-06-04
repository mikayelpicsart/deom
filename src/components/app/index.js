import React, { useEffect, useRef } from 'react';
import { _arrayToHeap, getImageData, StringToCharPtr } from '../../helpers/wasm';
import Module from'../../wasm/demo';


function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    (async function () {
      const imageData = await getImageData('https://cdn141.picsart.com/327941520116201.jpg');
      canvasRef.current.width = imageData.width;
      canvasRef.current.height = imageData.height;
      Module._createContext(imageData.width, imageData.height, StringToCharPtr('canvas'));
      console.log(imageData);
      const arrayInHeap = _arrayToHeap(imageData.data);

      Module._loadTexture(arrayInHeap.byteOffset, arrayInHeap.length)
    })()
  }, []);
  return (
    <div >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
