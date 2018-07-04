import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';

// view
import HomeVC from './home/vc/HomeVC';

// auction
import AuctionBoardVC from 'auction/vc/AuctionBoardVC';
import AuctionRegisterVC from 'auction/vc/AuctionRegisterVC';
import AuctionContentVC from 'auction/vc/AuctionContentVC';

// message
import MessageBoardVC from 'message/vc/MessageBoardVC';
import MessageContentVC from 'message/vc/MessageContentVC';

// etc
import MyPageVC from 'user/vc/MyPageVC';
import AuthVC from 'user/vc/AuthVC';
import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';

interface RouterModel {
  path: string;
  component: any;
  exact?: boolean;
}

class Router extends Component<{}, {}> {
  route = [
    {
      path: '/',
      component: HomeVC,
      exact: true,
    },
    {
      path: '/mypage',
      component: MyPageVC,
      exact: true,
    },
    {
      path: '/finacedata/register',
      component: RegisterFinanceInfoVC,
      exact: true,
    },
    {
      path: '/auction',
      component: AuctionBoardVC,
      exact: true,
    },
    {
      path: '/auction/register',
      component: AuctionRegisterVC,
      exact: true,
    },
    {
      path: '/auction/content/:id',
      component: AuctionContentVC,
      exact: false,
    },
    {
      path: '/message',
      component: MessageBoardVC,
      exact: true,
    },
    {
      path: '/message/content/:id',
      component: MessageContentVC,
      exact: false,
    },
    {
      path: '/auth',
      component: AuthVC,
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
