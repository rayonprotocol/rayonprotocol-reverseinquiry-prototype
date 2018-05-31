import React, { Component, Fragment } from 'react';

// dc
import ContractDC from 'common/dc/ContractDC';

// model
import User from './user/model/User';

// view
import Router from './Router';
import Nav from './common/view/Nav';

interface AppState {
  isInstanceReady: boolean;
}

class App extends Component<{}, AppState> {
  state = {
    ...this.state,
  };

  componentWillMount() {
    ContractDC.setInstanceReadyListner(this.instanceGetReady.bind(this));
    ContractDC.contractInit();
  }

  instanceGetReady() {
    this.setState({ ...this.state, isInstanceReady: true });
  }

  render() {
    const { isInstanceReady } = this.state;
    return (
      <div>
        {isInstanceReady && (
          <Fragment>
            <Nav />
            <Router />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
