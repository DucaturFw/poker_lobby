
import 'babel-core/register';
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';

import { ThemeProvider } from 'emotion-theming';
import { theme } from './theme';
import App from './App.js';
import Listener from './listener';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();
Listener({
  dispatch: store.dispatch.bind(store),
  getState: store.getState.bind(store)
});

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  window.document.getElementById('root')
);
registerServiceWorker();
