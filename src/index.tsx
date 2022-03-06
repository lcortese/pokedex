import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store';

import Theme from './Theme';
import App from './App';

ReactDom.render((
  <Provider store={store}>
    <BrowserRouter>
      <Theme>
        <App />
      </Theme>
    </BrowserRouter>
  </Provider>
), document.getElementById('app') as HTMLElement);
