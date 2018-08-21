import React, { Component } from 'react';

// view
import SignUpVC from 'user/vc/SignUpVC';
import RayonModalView from 'common/view/modal/RayonModalView';

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
          <img src={require('../../common/asset/img/rayon-logo.png')} />
        </div>
        <div className={styles.signUp}>
          <div className={styles.displayBtn}>
            <div className={styles.borrowerBtn}>Borrower</div>
            <div className={styles.lenderBtn}>Lender</div>
          </div>
          <div className={styles.signUpButton} onClick={this.onClickModal.bind(this)}>
            Sign Up
          </div>
        </div>
        {/* modal */}
        <RayonModalView isModalOpen={this.state.isSignUpModalOpen} onRequestClose={this.onRequestCloseModal.bind(this)}>
          <SignUpVC onCloseClicked={this.onClickModal.bind(this)} />
        </RayonModalView>
      </div>
    );
  }
}

export default RayonIntroView;
