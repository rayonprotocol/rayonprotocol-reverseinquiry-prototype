import React, { Component } from 'react';

// view
import RayonModalView from 'common/view/modal/RayonModalView';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './RegisterSuccessModelView.scss';

interface RegisterSuccessModelViewProps {
  onRequestCloseModal: () => void;
  isModalOpen: boolean;
  buttonColor: string;
}

class RegisterSuccessModelView extends Component<RegisterSuccessModelViewProps, {}> {
  render() {
    return (
      <RayonModalView onRequestClose={this.props.onRequestCloseModal} isModalOpen={this.props.isModalOpen}>
        <p> Your personal data was successfully saved</p>
        <RayonButton
          className={styles.confirmButton}
          title={'Confirm'}
          onClickButton={this.props.onRequestCloseModal}
          buttonColor={this.props.buttonColor}
        />
      </RayonModalView>
    );
  }
}

export default RegisterSuccessModelView;
