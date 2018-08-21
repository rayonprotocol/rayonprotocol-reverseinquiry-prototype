import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogSignUpEventArgs } from 'common/model/RayonEvent';

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
      path: '/auction/content',
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
      path: '/message/content',
      component: MessageContentVC,
      exact: false,
    },
  ];

  async componentWillMount() {
    // check user registered
    const isUser = await UserDC.isUser();

    UserDC.addUserListeners(this.onUserFetched.bind(this));

    // if user does not exist on block chain, listen sign up event
    // if user exist on block chain, fetch user information
    isUser ? UserDC.fetchUser() : UserDC.addEventListener(RayonEvent.LogSignUpUser, this.onUserSignUp.bind(this));
  }

  componentWillUnmount() {
    UserDC.addEventListener(RayonEvent.LogSignUpUser, this.onUserSignUp.bind(this));
  }

  onUserFetched(user: User) {
    this.setState({ ...this.state, user });
  }

  onUserSignUp(event: RayonEventResponse<LogSignUpEventArgs>) {
    UserDC.fetchUser();
  }

  render() {
    const { user } = this.state;
    return (
      <Fragment>
        {!user ? (
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
                    render={props => <item.component {...props} />}
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
