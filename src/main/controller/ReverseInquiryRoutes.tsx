import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import TabNav from 'common/view/nav/TabNav';
import RayonIntroView from 'home/view/RayonIntroView';

import AuctionBoardVC from 'auction/vc/AuctionBoardVC';
import MessageBoardVC from 'message/vc/MessageBoardVC';
import AuctionContentVC from 'auction/vc/AuctionContentVC';
import MessageContentVC from 'message/vc/MessageContentVC';
import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';

interface ReverseInquiryRoutesState {
  user: User;
}

class ReverseInquiryRoutes extends Component<{}, ReverseInquiryRoutesState> {
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
      component: AuctionBoardVC,
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
    {
      path: '/message/content/:id',
      component: MessageContentVC,
      exact: false,
    },
  ];

  componentDidMount() {
    UserDC.addUserListener(ReverseInquiryRoutes.name, this.onUpdateUser);
    UserDC.getUser();
  }
  componentWillUnmount() {
    UserDC.removeUserListener(ReverseInquiryRoutes.name);
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

export default ReverseInquiryRoutes;
