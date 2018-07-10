import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import TabNav from 'common/view/nav/TabNav';
import HomeVC from './home/vc/HomeVC';
import RayonIntroView from 'home/view/RayonIntroView';

import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';
import AuctionBoardVC from 'auction/vc/AuctionBoardVC';
import AuctionContentVC from 'auction/vc/AuctionContentVC';
import MessageBoardVC from 'message/vc/MessageBoardVC';

interface RouterState {
  user: User;
}

class Router extends Component<{}, RouterState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
    };
  }

  route = [
    {
      path: '/',
      component: HomeVC,
      exact: true,
    },
    {
      path: '/registerdata',
      component: RegisterFinanceInfoVC,
      exact: true,
    },
    {
      path: '/auction/content/:id',
      component: AuctionContentVC,
      exact: false,
    },
    {
      path: '/loanrequest',
      component: AuctionBoardVC,
      exact: true,
    },
    {
      path: '/mailbox',
      component: MessageBoardVC,
      exact: true,
    },
  ];

  componentDidMount() {
    UserDC.addUserListener(HomeVC.name, this.onUpdateUser);
    UserDC.getUser();
  }
  componentWillUnmount() {
    UserDC.removeUserListener(HomeVC.name);
  }

  onUpdateUser = (user: User) => {
    this.setState({ ...this.state, user });
  };

  render() {
    const { user } = this.state;
    return (
      <Fragment>
        {user === undefined ? (
          <RayonIntroView />
        ) : (
          <BrowserRouter>
            <Fragment>
              <TabNav />
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
          </BrowserRouter>
        )}
      </Fragment>
    );
  }
}

export default Router;
