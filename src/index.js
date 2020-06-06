import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';
import { ReadyWasm } from './helpers/wasm-ready';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="Loading ..." >
      <ReadyWasm>
        <App />
      </ReadyWasm>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
