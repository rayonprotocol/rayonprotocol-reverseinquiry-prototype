import '!script-loader!console-polyfill';
import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import history from 'common/util/Histroy';

import App from './App';

// style
import './assets/style.scss';

ReactDom.render(
  <AppContainer>
    <Router history={history}>
      <App />
    </Router>
  </AppContainer>,
  document.getElementById('root'),
);
