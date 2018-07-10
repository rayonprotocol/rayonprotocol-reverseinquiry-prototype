import React, { Component } from 'react';

// dc
import UserDC from 'user/dc/UserDC';

// view

import ModalTitle from 'common/view/modal/ModalTitle';
import CommonSelectInput from 'common/view/input/CommonSelectInput';
import CommonTextInput from 'common/view/input/CommonTextInput';
import CommonRayonButton from 'common/view/button/CommonRayonButton';

// styles
import styles from './SignUpVC.scss';

interface SignUpVCProps {
  onClickModal: () => void;
}

interface SignUpVCState {
  userName: string;
  isBorrower: boolean;
}

class SignUpVC extends Component<SignUpVCProps, SignUpVCState> {
  public Lender = 'Lender';
  public Borrower = 'Borrower';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isBorrower: true,
    };
  }

  // Change Event
  onChangeOption(event) {
    const isBorrower = event.target.value === this.Borrower;
    this.setState({ ...this.state, isBorrower });
  }

  onChangeUserName(event) {
    const userName = event.target.value;
    this.setState({ ...this.state, userName });
  }

  // Click Event
  async onClickSubmitButton() {
    const { userName, isBorrower } = this.state;
    if (!this.validInputValues(userName, isBorrower)) return alert('type all input values');
    await UserDC.userSignUp(userName, isBorrower);
    this.props.onClickModal();
  }

  validInputValues(userName: string, isBorrower: boolean) {
    return userName !== '' && userName !== undefined && isBorrower !== undefined;
  }

  render() {
    const options = [this.Borrower, this.Lender];

    return (
      <div className={styles.contentsContainer}>
        <ModalTitle title={'Sign Up'} onCloseRequest={this.props.onClickModal} />
        <CommonSelectInput
          className={styles.selectInput}
          title={'type'}
          options={options}
          onChangeOption={this.onChangeOption.bind(this)}
        />
        <CommonTextInput
          className={styles.selectInput}
          title={'User Name'}
          onChangeInputValue={this.onChangeUserName.bind(this)}
        />
        <CommonRayonButton
          className={styles.submitButton}
          title={'Submit'}
          isBorrower={true}
          onClickButton={this.onClickSubmitButton.bind(this)}
        />
      </div>
    );
  }
}

export default SignUpVC;
