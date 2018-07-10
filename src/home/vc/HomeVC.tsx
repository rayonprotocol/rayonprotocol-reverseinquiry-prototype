import React, { Component } from 'react';
import Modal from 'react-modal';

// model
import User from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import SignUpVC from 'user/vc/SignUpVC';

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
    return (
      <div className={styles.contentContainer}>
        <div className={styles.topMain}>
          <img src={require('../images/rayon-logo.png')} />
        </div>
        <div className={styles.signUp}>
          <div className={styles.signUpButton} onClick={this.onClickModal.bind(this)}>
            Sign Up
          </div>
        </div>
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
            content: {
              width: '85%',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              borderRadius: '0px',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <SignUpVC onClickModal={this.onClickModal.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default HomeVC;
