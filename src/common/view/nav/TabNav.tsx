import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// dc
import UserDC from 'user/dc/UserDC';

// view
import ArrayTabView from 'common/view/tab/ArrayTabView';
import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';
import AuctionBoardVC from 'auction/vc/AuctionBoardVC';
import MessageBoardVC from 'message/vc/MessageBoardVC';

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

  renderBorrowerContents(activedTabIndex: number) {
    if (activedTabIndex === 0) {
      return <RegisterFinanceInfoVC />;
    } else if (activedTabIndex === 1) {
      return <AuctionBoardVC />;
    } else {
      return <MessageBoardVC />;
    }
  }

  renderLenderContents(activedTabIndex: number) {
    if (activedTabIndex === 0) {
      return <AuctionBoardVC />;
    } else {
      return <MessageBoardVC />;
    }
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
        </nav>
        <ArrayTabView
          tabMenus={tabMenus}
          activedIndex={activedTabIndex}
          onClickTabMenu={this.onClickTabMenu.bind(this)}
        />
        {user.isBorrower ? this.renderBorrowerContents(activedTabIndex) : this.renderLenderContents(activedTabIndex)}
      </Fragment>
    );
  }
}

export default TabNav;
