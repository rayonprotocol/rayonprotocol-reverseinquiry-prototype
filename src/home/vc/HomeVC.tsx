import React, { Component } from 'react';

// model
import User from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import TabNav from 'common/view/nav/TabNav';
import RayonIntroView from 'home/view/RayonIntroView';

// styles
import styles from './HomeVC.scss';

interface HomeState {
  isSignUpModalOpen: boolean;
  user: User;
}

class HomeVC extends Component<{}, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
    };
  }

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

  onClickModal(isClose?: boolean) {
    this.setState({ ...this.state, isSignUpModalOpen: !this.state.isSignUpModalOpen });
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isSignUpModalOpen: false });
  }

  render() {
    const { user } = this.state;
    return user === undefined ? (
      <RayonIntroView />
    ) : (
      <div>
        <TabNav />
      </div>
    );
  }
}

export default HomeVC;
