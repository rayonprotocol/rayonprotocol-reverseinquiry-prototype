import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogUserSignUpArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';

// view
import TabNav from 'common/view/nav/TabNav';
import RayonIntroView from 'home/view/RayonIntroView';
import MessageBoardVC from 'message/vc/MessageBoardVC';
import MessageContentVC from 'message/vc/MessageContentVC';
import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';
import ReverseInquiryBoardVC from 'reverseinquiry/vc/ReverseInquiryBoardVC';
import ReverseInquiryContentVC from 'reverseinquiry/vc/ReverseInquiryContentVC';

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
      component: ReverseInquiryBoardVC,
      exact: true,
    },
    {
      path: '/registerdata',
      component: RegisterFinanceInfoVC,
      exact: true,
    },
    {
      path: '/reverseinquiry/content',
      component: ReverseInquiryContentVC,
      exact: false,
    },
    {
      path: '/loanrequest',
      component: ReverseInquiryBoardVC,
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
    UserDC.addUserListeners(this.onUserFetched.bind(this));

    // check user registered
    const isUser: boolean = await UserDC.isUser();

    // if user does not exist on block chain, listen sign up event
    // if user exist on block chain, fetch user information
    if (isUser) UserDC.fetchUser();
    else UserDC.addEventListener(RayonEvent.LogUserSignUp, this.onUserSignUp.bind(this));
  }

  componentWillUnmount() {
    UserDC.removeEventListener(RayonEvent.LogUserSignUp, this.onUserSignUp.bind(this));
  }

  onUserFetched(user: User) {
    this.setState({ ...this.state, user });
  }

  onUserSignUp(event: RayonEventResponse<LogUserSignUpArgs>) {
    UserDC.fetchUser();
  }

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
