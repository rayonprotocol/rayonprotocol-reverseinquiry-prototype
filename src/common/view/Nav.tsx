import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// dc
import UserDC from 'user/dc/UserDC';

// model
import ModalForm from 'modal/model/ModalForm';

// view
import Container from './Container';
import ModalVC from '../../modal/vc/ModalVC';

// styles
import styles from './Nav.scss';
import User from 'user/model/User';

interface NavState {
  isOpenModal: boolean[];
  user: User;
}

class Nav extends Component<{}, NavState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isOpenModal: [false, false, false, false, false],
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

  onClickModal(modalType: number) {
    const { isOpenModal } = this.state;
    switch (modalType) {
      case ModalForm.SIGNUP_MODAL:
        isOpenModal[ModalForm.SIGNUP_MODAL] = !isOpenModal[ModalForm.SIGNUP_MODAL];
        break;
      case ModalForm.AUTH_MODAL:
        isOpenModal[ModalForm.AUTH_MODAL] = !isOpenModal[ModalForm.AUTH_MODAL];
        break;
      default:
        break;
    }
    this.setState({ ...this.state, isOpenModal });
  }

  getIsModalOpen(modalType: number) {
    return this.state.isOpenModal[modalType];
  }

  renderUserSection() {
    const { user } = this.state;
    if (!user) {
      return (
        <ul>
          <li onClick={() => this.onClickModal(ModalForm.SIGNUP_MODAL)}>Create Account</li>
        </ul>
      );
    }
    return (
      <ul>
        <li>
          <Link to={'/mypage'}>{user.userName}</Link>
        </li>
        <li>{user.isBorrower && <Link to={'/finacedata/register'}>{'Register Data'}</Link>}</li>
        <li>
          <Link to={'/message'}>{'Inbox'}</Link>
        </li>
      </ul>
    );
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
        <ModalVC getIsModalOpen={this.getIsModalOpen.bind(this)} onClickModal={this.onClickModal.bind(this)} />
      </nav>
    );
  }
}

export default Nav;
