import React, { Component, Fragment } from 'react';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import RayonBlueButton from 'common/view/button/RayonBlueButton';
import TopBanner from 'common/view/banner/TopBanner';

// util
import history from 'common/util/Histroy';

// styles
import styles from './AuthVC.scss';

interface AuthVCState {
  agreeText: string;
  isAgreeTextError: boolean;
}

class AuthVC extends Component<{}, AuthVCState> {
  public REQUIRE_AGREE_TEXT = 'agree';

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
    return agreeText === undefined || agreeText !== this.REQUIRE_AGREE_TEXT;
  }

  async onClickSubmitButton() {
    if (!this.validationAgreeText()) return this.setState({ ...this.state, isAgreeTextError: true });
    await UserDC.userAuth();
    history.push('/');
  }

  render() {
    const { isAgreeTextError } = this.state;

    return (
      <Fragment>
        <TopBanner title={'KYC Validation'} description={'KYC authentication required for personal data attestation'} />
        <Container className={styles.contentsContainer}>
          <div>Performing KYC authentication. Type "{this.REQUIRE_AGREE_TEXT}" to consent</div>
          <div className={styles.inputWrapper}>
            <div />
            <input onChange={this.onChangeAgreeText.bind(this)} type={'text'} />
          </div>
          {isAgreeTextError && (
            <div className={styles.errorMessage}>
              <div>Check Spelling</div>
            </div>
          )}
          <RayonBlueButton onClick={this.onClickSubmitButton.bind(this)} title={'Validate'} />
        </Container>
      </Fragment>
    );
  }
}

export default AuthVC;
