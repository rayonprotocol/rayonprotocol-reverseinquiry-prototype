import React, { Component } from 'react';

// model
import { UserType } from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import ModalTitle from 'common/view/modal/ModalTitle';
import SelectInput from 'common/view/input/SelectInput';
import TextInput from 'common/view/input/TextInput';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';


// util
import StringUtil from 'common/util/StringUtil';

// styles
import styles from './SignUpModalView.scss';

interface SignUpModalViewProps {
  isModalOpen: boolean;
  onCloseClicked: () => void;
}

interface SignUpModalViewState {
  userName: string;
  isBorrower: boolean;
}

class SignUpModalView extends Component<SignUpModalViewProps, SignUpModalViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isBorrower: true,
    };
  }

  onChangeUserType(event) {
    this.setState({
      ...this.state,
      isBorrower: event.target.value === UserType.getUserTypeNames(UserType.ENTITY_BORROWER),
    });
  }

  onChangeUserName(event) {
    this.setState({ ...this.state, userName: event.target.value });
  }

  onClickSubmitButton() {
    if (!this.validInputValues(this.state.userName, this.state.isBorrower)) {
      alert('type all input values');
      return;
    }
    UserDC.signUp(this.state.userName, this.state.isBorrower);
    this.props.onCloseClicked();
  }

  validInputValues(userName: string, isBorrower: boolean): boolean {
    return !StringUtil.isEmpty(userName) && isBorrower !== undefined;
  }

  render() {
    return (
      <RayonModalView isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onCloseClicked}>
        <div className={styles.contentsContainer}>
          <ModalTitle title={'Sign Up'} onCloseRequest={this.props.onCloseClicked} />
          <SelectInput
            className={styles.selectInput}
            title={'Type'}
            options={[
              UserType.getUserTypeNames(UserType.ENTITY_BORROWER),
              UserType.getUserTypeNames(UserType.ENTITY_LENDER),
            ]}
            onChangeOption={this.onChangeUserType.bind(this)}
          />
          <TextInput
            className={styles.selectInput}
            title={'User Name'}
            onChangeInputValue={this.onChangeUserName.bind(this)}
          />
          <RayonButton
            className={styles.submitButton}
            title={'Submit'}
            onClickButton={this.onClickSubmitButton.bind(this)}
          />
        </div>
      </RayonModalView>
    );
  }
}

export default SignUpModalView;
