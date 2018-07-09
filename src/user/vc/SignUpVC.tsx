import React, { Component } from 'react';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import RayonBlueButton from 'common/view/button/RayonBlueButton';
import FocusAniInput from 'common/view/input/FocusAniInput';
import ToggleButton from 'common/view/input/ToggleButton';

// styles
import styles from './SignUpVC.scss';

interface SignUpVCProps {
  onClickModal: () => void;
}

interface SignUpVCState {
  userName: string;
  isBorrower: boolean;
  isExistUser: boolean;
}

class SignUpVC extends Component<SignUpVCProps, SignUpVCState> {
  public Lender = 'Lender';
  public Borrower = 'Borrower';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isExistUser: false,
    };
  }

  // Change Input Events
  onChangeUserStatus(event) {
    const isBorrower = event.target.value === this.Borrower;
    this.setState({ ...this.state, isBorrower });
  }

  onChangeUserName(event) {
    const userName = event.target.value;
    this.setState({ ...this.state, userName });
  }

  // Click Button Events
  async onClickSubmitButton() {
    const { userName, isBorrower } = this.state;
    const resultSignUp = await UserDC.userSignUp(userName, isBorrower);
    resultSignUp ? this.props.onClickModal() : this.setState({ ...this.state, isExistUser: true });
  }

  render() {
    const { isExistUser } = this.state;
    const radioButton = [this.Lender, this.Borrower];

    return (
      <Container className={styles.contentsContainer}>
        <img
          className={styles.closeBtn}
          src={require('../../assets/img/closeIcon.png')}
          onClick={() => this.props.onClickModal()}
        />
        <div className={styles.signUpSection}>
          <div className={styles.title}>Create Account</div>
          {/* SignUP View */}
          <div className={styles.signUp}>
            <ToggleButton
              dataList={radioButton}
              title={'Account Type'}
              name={'signup'}
              onChangeToggleButton={this.onChangeUserStatus.bind(this)}
            />
            <FocusAniInput title={'User ID'} onChangeInput={this.onChangeUserName.bind(this)} />
            {isExistUser && (
              <div className={styles.errorMessage}>
                <div>your account is already exist on blockchain</div>
              </div>
            )}
            <div className={styles.buttonWrap}>
              <RayonBlueButton onClick={this.onClickSubmitButton.bind(this)} title={'Submit'} />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default SignUpVC;
