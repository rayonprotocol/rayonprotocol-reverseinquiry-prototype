import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';

// view
import HomeVC from './home/vc/HomeVC';

interface RouterModel {
  path: string;
  component: any;
  exact?: boolean;
}

interface RouterProps {}

class Router extends Component<RouterProps, {}> {
  route = [
    {
      path: '/',
      component: HomeVC,
      exact: true,
    },
  ];

  render() {
    return (
      <Fragment>
        {this.route.map((item, index) => {
          return (
            <Route
              key={index}
              exact={item.exact}
              path={item.path}
              render={props => <item.component {...props} {...this.props} />}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default Router;
