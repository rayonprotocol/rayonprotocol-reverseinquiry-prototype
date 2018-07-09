import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from './Container';
import SignUpVC from 'user/vc/SignUpVC';

// styles
import styles from './Nav.scss';
import User from 'user/model/User';

interface NavState {
  isSignUpModalOpen: boolean;
  user: User;
}

class Nav extends Component<{}, NavState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
    };
  }

  componentDidMount() {
    UserDC.addUserListener(Nav.name, this.onUpdateUser);
    UserDC.getUser();
  }
  componentWillUnmount() {
    UserDC.removeUserListener(Nav.name);
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

  renderUserSection() {
    const { user } = this.state;
    if (!user) {
      return (
        <ul>
          <li onClick={this.onClickModal.bind(this)}>Create Account</li>
        </ul>
      );
    } else {
      return (
        <ul>
          <li>
            <Link to={'/mypage'}>{user.userName}</Link>
          </li>
          <li>{user.isBorrower && <Link to={'/finacedata/register'}>{'Register Data'}</Link>}</li>
          <li>
            <Link to={'/message'}>{'Mailbox'}</Link>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav className={styles.navigationBar}>
        <Container noTopPadding={true}>
          <div className={styles.mainSection}>
            <ul>
              <li className={styles.logo}>
                <Link to={'/'}>
                  <img src={require('../../assets/img/rayon-logo.png')} />
                </Link>
              </li>
              <li>
                <Link to={'/auction'}>Loan Requests</Link>
              </li>
            </ul>
          </div>
          <div className={styles.userSection}>{this.renderUserSection()}</div>
        </Container>
        {/* modal */}
        <Modal
          ariaHideApp={false}
          className={styles.modal}
          isOpen={this.state.isSignUpModalOpen}
          onRequestClose={this.onRequestCloseModal.bind(this)}
          shouldCloseOnOverlayClick={true}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <SignUpVC onClickModal={this.onClickModal.bind(this)} />
        </Modal>
      </nav>
    );
  }
}

export default Nav;
