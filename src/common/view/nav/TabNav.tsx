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
  activedTabIndex: number;
  user: User;
}

class TabNav extends Component<{}, TabNavState> {
  borrowerTabMenus = ['Register Data', 'Loan Request', 'Mailbox'];
  lenderTabMenus = ['Loan Request', 'Mailbox'];

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
  }

  async componentWillMount() {
    UserDC.addUserListeners(this.onUserFetched.bind(this));
    UserDC.fetchUser();
  }

  componentWillUnmount() {
    UserDC.removeUserListeners(this.onUserFetched.bind(this));
  }

  onUserFetched(user: User) {
    const activedTabIndex = this.getActivatedTabIndexByUrl(user.isBorrower);
    this.setState({ ...this.state, user, activedTabIndex });
  }

  getActivatedTabIndexByUrl(isBorrower: boolean) {
    const currentBaseUrl = window.location.pathname.split('/')[1];
    const tabMenus = isBorrower
      ? this.mekeLowerCaseList(this.borrowerTabMenus)
      : this.mekeLowerCaseList(this.lenderTabMenus);
    return tabMenus.indexOf(currentBaseUrl) === -1 ? tabMenus.indexOf('loanrequest') : tabMenus.indexOf(currentBaseUrl);
  }

  mekeLowerCaseList(list: string[]) {
    return list.map(item =>
      item
        .toLowerCase()
        .split(' ')
        .join('')
    );
  }

  onClickTabMenu(index: number) {
    this.setState({ ...this.state, activedTabIndex: index });
  }

  render() {
    const { activedTabIndex, user } = this.state;
    return user ? (
      <Fragment>
        <nav
          className={classNames(styles.navigationBar, {
            [styles.borrower]: user.isBorrower,
            [styles.lender]: !user.isBorrower,
          })}
        >
          <Link to={'/'}>
            <img className={styles.logo} src={require('../../../common/asset/img/rayon-white-logo.png')} />
          </Link>
          <div className={styles.user}>
            <img className={styles.profileImg} />
            <p className={styles.userName}>{user.userName}</p>
          </div>
          <div />
        </nav>
        <ArrayTabView
          tabMenus={user.isBorrower ? this.borrowerTabMenus : this.lenderTabMenus}
          activedIndex={activedTabIndex}
          isBorrower={user.isBorrower}
          onClickTabMenu={this.onClickTabMenu.bind(this)}
        />
      </Fragment>
    ) : null;
  }
}

export default TabNav;
