import React, { Component } from 'react';

// view
import SignUpModalView from 'user/view/SignUpModalView';

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

  onRequestModalOpenStateToggle() {
    // break out when click open button, modal background, close button
    this.setState({ ...this.state, isSignUpModalOpen: !this.state.isSignUpModalOpen });
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
          <div className={styles.signUpButton} onClick={this.onRequestModalOpenStateToggle.bind(this)}>
            Sign Up
          </div>
        </div>
        <SignUpModalView
          isModalOpen={this.state.isSignUpModalOpen}
          onCloseClicked={this.onRequestModalOpenStateToggle.bind(this)}
        />
      </div>
    );
  }
}

export default RayonIntroView;
