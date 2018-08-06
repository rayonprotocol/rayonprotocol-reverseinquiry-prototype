import '!script-loader!console-polyfill';
import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import history from 'common/util/Histroy';

// view
import ReverseInquiryRoutes from 'main/controller/ReverseInquiryRoutes';

// style
import 'common/asset/style.scss';

ReactDom.render(
  <AppContainer>
    <Router history={history}>
      <ReverseInquiryRoutes />
    </Router>
  </AppContainer>,
  document.getElementById('root')
);
