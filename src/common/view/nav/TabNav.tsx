import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// view
import ArrayTabView from 'common/view/tab/ArrayTabView';

// styles
import styles from './TabNav.scss';
import User from 'user/model/User';

interface TabNavProps {
  user: User;
}

interface TabNavState {
  activedTabIndex: number;
}

class TabNav extends Component<TabNavProps, TabNavState> {
  borrowerTabMenus = ['Register Data', 'Loan Request', 'Mailbox'];
  lenderTabMenus = ['Loan Request', 'Mailbox'];

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      activedTabIndex: this.getActivatedTabIndexByUrl(),
    };
  }

  getActivatedTabIndexByUrl() {
    const currentBaseUrl = window.location.pathname.split('/')[1];
    const tabMenus = this.props.user.isBorrower
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
    const { user } = this.props;
    const { activedTabIndex } = this.state;
    const tabMenus = user.isBorrower ? this.borrowerTabMenus : this.lenderTabMenus;
    return (
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
