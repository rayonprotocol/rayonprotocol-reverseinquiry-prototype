import React, { Component } from 'react';
import Modal from 'react-modal';

// view
import SignUpVC from 'user/vc/SignUpVC';

// styles
import styles from './RayonIntroView.scss';

interface RayonIntroViewState {
  isSignUpModalOpen: boolean;
}

class RayonIntroView extends Component<{}, RayonIntroViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isSignUpModalOpen: false,
    };
  }

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

export default RayonIntroView;
