import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { Provider } from 'react-redux';
import store from './redux/store';

import Alert from './alert';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Alert />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);