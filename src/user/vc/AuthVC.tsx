import React, { Component } from 'react';

// dc
import ContractDC, { ContractInstance } from 'common/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import ModalForm from 'modal/model/ModalForm';
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';

// styles
import styles from './AuthVC.scss';

interface AuthVCProps {
  onClickModal: (modalType: number) => void;
}

interface AuthVCState {
  agreeText: string;
  isAgreeTextError: boolean;
}

class AuthVC extends Component<AuthVCProps, AuthVCState> {
  public REQUIRE_AGREE_TEXT = '동의';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isAgreeTextError: false,
    };
  }

  onChangeAgreeText(event) {
    const agreeText = event.target.value;
    this.setState({ ...this.setState, agreeText });
  }

  validationAgreeText() {
    const { agreeText } = this.state;
    if (agreeText === undefined || agreeText !== this.REQUIRE_AGREE_TEXT) return false;
    return true;
  }

  async onClickSubmitButton() {
    if (!this.validationAgreeText()) return this.setState({ ...this.state, isAgreeTextError: true });
    await UserDC.userAuth();
    this.props.onClickModal(ModalForm.AUTH_MODAL);
  }

  render() {
    const { isAgreeTextError } = this.state;

    return (
      <Container className={styles.contentsContainer}>
        <div onClick={() => this.props.onClickModal(ModalForm.AUTH_MODAL)} className={styles.closeBtn}>
          X
        </div>
        <div className={styles.title}>KYC Auth page</div>
        <div>KYC를 진행합니다. 동의하시면 '{this.REQUIRE_AGREE_TEXT}' 텍스트를 입력해주세요</div>
        <div className={styles.inputWrapper}>
          <div />
          <input onChange={this.onChangeAgreeText.bind(this)} type={'text'} />
        </div>
        {isAgreeTextError && (
          <div className={styles.errorMessage}>
            <div> 정확하게 입력해주시바랍니다.</div>
          </div>
        )}
        <MarchBlueButton onClick={this.onClickSubmitButton.bind(this)} title={this.REQUIRE_AGREE_TEXT} />
      </Container>
    );
  }
}

export default AuthVC;
