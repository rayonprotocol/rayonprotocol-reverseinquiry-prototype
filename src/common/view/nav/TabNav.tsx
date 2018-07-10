import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
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

  // renderUserSection() {
  //   const { user } = this.state;
  //   return (
  //     <ul>
  //       <li>
  //         <Link to={'/mypage'}>{user.userName}</Link>
  //       </li>
  //       <li>{user.isBorrower && <Link to={'/finacedata/register'}>{'Register Data'}</Link>}</li>
  //       <li>
  //         <Link to={'/message'}>{'Mailbox'}</Link>
  //       </li>
  //     </ul>
  //   );
  // }

  onClickTabMenu(index: number) {
    this.setState({ ...this.state, activedTabIndex: index });
  }

  render() {
    const { user, activedTabIndex } = this.state;
    const tabMenus = user.isBorrower ? ['Register Data', 'Loan', 'Mailbox'] : ['Loan Request', 'Mailbox'];
    return (
      <Fragment>
        <nav className={styles.navigationBar}>
          <Link to={'/'}>
            <img className={styles.logo} src={require('../../../assets/img/rayon-white-logo.png')} />
          </Link>
          <div className={styles.user}>
            <img className={styles.profileImg} />
            <p className={styles.userName}>{user.userName}</p>
          </div>
          <div />
          {/* <div>
                <Link to={'/auction'}>Loan Requests</Link>
              </div> */}
          {/* <div className={styles.userSection}>{this.renderUserSection()}</div> */}
        </nav>
        <ArrayTabView
          tabMenus={tabMenus}
          activedIndex={activedTabIndex}
          onClickTabMenu={this.onClickTabMenu.bind(this)}
        />
      </Fragment>
    );
  }
}

export default TabNav;
