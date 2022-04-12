import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import './index.scss';
import './fonts/fonts.scss';

import { Provider } from 'react-redux';
import store from './redux/store';

import Alert from './alert';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Alert />
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);