import React, { Component } from 'react';

// dc
import ContractDC from 'common/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import ModalForm from 'modal/model/ModalForm';
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';
import FocusAniInput from 'common/view/input/FocusAniInput';
import ToggleButton from 'common/view/input/ToggleButton';

// styles
import styles from './SignUpVC.scss';

interface SignUpVCProps {
  onClickModal: (modalType: number) => void;
}

interface SignUpVCState {
  userName: string;
  isBorrower: boolean;
  isExistUser: boolean;
}

class SignUpVC extends Component<SignUpVCProps, SignUpVCState> {
  public Lender = 'Lender';
  public Borrower = 'Borrower';
  public RADIOBUTTON = 'radioButton';

  radioButton = [this.Lender, this.Borrower];

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
    resultSignUp
      ? this.props.onClickModal(ModalForm.SIGNUP_MODAL)
      : this.setState({ ...this.state, isExistUser: true });
  }

  async onClickGetUserButton() {
    console.log(UserDC.getUserFromBlockchain(ContractDC.getAccount()));
  }

  render() {
    const { isExistUser } = this.state;

    return (
      <Container className={styles.contentsContainer}>
        <img
          className={styles.closeBtn}
          src={require('../../assets/img/closeIcon.png')}
          onClick={() => this.props.onClickModal(ModalForm.SIGNUP_MODAL)}
        />
        <div className={styles.signUpSection}>
          <div className={styles.title}>회원가입</div>
          {/* SignUP View */}
          <div className={styles.signUp}>
            <ToggleButton
              dataList={this.radioButton}
              title={'가입 유형'}
              name={'signup'}
              onChangeToggleButton={this.onChangeUserStatus.bind(this)}
            />
            <FocusAniInput title={'닉네임'} onChangeInput={this.onChangeUserName.bind(this)} />
            {isExistUser && (
              <div className={styles.errorMessage}>
                <div>your account is already exist on blockchain</div>
              </div>
            )}
            <div className={styles.buttonWrap}>
              <MarchBlueButton onClick={this.onClickSubmitButton.bind(this)} title={'가입하기'} />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default SignUpVC;
