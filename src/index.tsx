import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Theme from './Theme';
import App from './App';

ReactDom.render((
  <BrowserRouter>
    <Theme>
      <App />
    </Theme>
  </BrowserRouter>
), document.getElementById('app') as HTMLElement);
