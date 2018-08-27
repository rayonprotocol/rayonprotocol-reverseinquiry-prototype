import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import User from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';

// dc
import RayonMainDC from 'main/dc/RayonMainDC';
import UserDC from 'user/dc/UserDC';

// view
import ArrayTab from 'common/view/tab/ArrayTab';

// styles
import styles from './RayonTabNavView.scss';

interface RayonTabNavViewState {
  user: User;
  navTabMenus: string[];
  activedTabIndex: number;
}

class RayonTabNavView extends Component<{}, RayonTabNavViewState> {
  constructor(props) {
    super(props);
    const user = UserDC.getUser();
    this.state = {
      ...this.state,
      user,
      navTabMenus: RayonMainDC.getTabMenus(user.isBorrower),
    };
  }

  onClickTabMenu(index: number) {
    this.setState({ ...this.state, activedTabIndex: index });
  }

  render() {
    return (
      <Fragment>
        <nav
          className={styles.navigationBar}
          style={{ backgroundColor: this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY }}
        >
          <Link to={'/'}>
            <img className={styles.logo} src={require('common/asset/img/rayon-white-logo.png')} />
          </Link>
          <div className={styles.user}>
            <img className={styles.profileImg} />
            <p className={styles.userName}>{this.state.user.userName}</p>
          </div>
          <div />
        </nav>
        <ArrayTab
          tabMenus={this.state.navTabMenus}
          activedTabIndex={this.state.activedTabIndex}
          backgroundColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
          onClickTabMenu={this.onClickTabMenu.bind(this)}
        />
      </Fragment>
    );
  }
}

export default RayonTabNavView;
