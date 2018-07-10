import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// dc
import UserDC from 'user/dc/UserDC';

// view
import ArrayTabView from 'common/view/tab/ArrayTabView';

// styles
import styles from './TabNav.scss';
import User from 'user/model/User';

interface TabNavState {
  user: User;
  activedTabIndex: number;
}

class TabNav extends Component<{}, TabNavState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      activedTabIndex: 0,
      user: UserDC.getUser(),
    };
  }

  componentDidMount() {
    UserDC.addUserListener(TabNav.name, this.onUpdateUser);
    UserDC.getUser();
  }
  componentWillUnmount() {
    UserDC.removeUserListener(TabNav.name);
  }

  onUpdateUser = (user: User) => {
    this.setState({ ...this.state, user });
  };

  onClickTabMenu(index: number) {
    this.setState({ ...this.state, activedTabIndex: index });
  }

  render() {
    const { user, activedTabIndex } = this.state;
    const tabMenus = user.isBorrower ? ['Register Data', 'Loan Request', 'Mailbox'] : ['Loan Request', 'Mailbox'];
    return (
      <Fragment>
        <nav
          className={classNames(styles.navigationBar, {
            [styles.borrower]: user.isBorrower,
            [styles.lender]: !user.isBorrower,
          })}
        >
          <Link to={'/'}>
            <img className={styles.logo} src={require('../../../assets/img/rayon-white-logo.png')} />
          </Link>
          <div className={styles.user}>
            <img className={styles.profileImg} />
            <p className={styles.userName}>{user.userName}</p>
          </div>
          <div />
        </nav>
        <ArrayTabView
          tabMenus={tabMenus}
          activedIndex={activedTabIndex}
          isBorrower={user.isBorrower}
          onClickTabMenu={this.onClickTabMenu.bind(this)}
        />
      </Fragment>
    );
  }
}

export default TabNav;
