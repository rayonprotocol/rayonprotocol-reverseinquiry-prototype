import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogUserSignUpArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';

// view
import RayonTabNavView from 'main/view/RayonTabNavView';
import RayonIntroView from 'home/view/RayonIntroView';
import MessageBoardVC from 'reverseinquiry/vc/MessageBoardVC';
import MessageContentVC from 'reverseinquiry/vc/MessageContentVC';
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
    this.onUserSignUp = this.onUserSignUp.bind(this);
  }

  routes = [
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

  async componentWillMount(): Promise<void> {
    const isUserRegistered: boolean = await UserDC.isUser();

    if (isUserRegistered) {
      UserDC.addUserListener(this.onUserFetched.bind(this));
      UserDC.fetchUser();
    } else {
      UserDC.addEventListener(RayonEvent.LogUserSignUp, this.onUserSignUp);
    }
  }

  componentWillUnmount(): void {
    UserDC.removeEventListener(RayonEvent.LogUserSignUp, this.onUserSignUp);
  }

  onUserFetched(user: User): void {
    this.setState({ ...this.state, user });
  }

  // TODO: callback은 가공된 데이터를 받는다. 데이터가공은 DC에서 처리.
  onUserSignUp(event: RayonEventResponse<LogUserSignUpArgs>): void {
    const user: User = {
      userAddress: event.args.userAddress,
      userName: event.args.userName,
      isBorrower: event.args.isBorrower,
    };
    UserDC.setUser(user);
    this.setState({ ...this.state, user });
  }

  render() {
    return this.state.user === undefined ? (
      <RayonIntroView />
    ) : (
      <BrowserRouter>
        <Fragment>
          <RayonTabNavView />
          {this.routes.map((item, index) => {
            return (
              <Route key={index} exact={item.exact} path={item.path} render={props => <item.component {...props} />} />
            );
          })}
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default ReverseInquiryRoutes;
