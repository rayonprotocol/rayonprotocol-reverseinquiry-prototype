import React, { Component } from 'react';

// model
import { RAYON_BERRY } from 'common/model/Style';
import { FinanceProductType } from 'reverseinquiry/model/Message';

// view
import TextInput from 'common/view/input/TextInput';
import ModalTitle from 'common/view/modal/ModalTitle';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';

// styles
import styles from './MessageProductOfferModalView.scss';

interface MessageProductOfferModalViewProps {
  isModalOpen: boolean;
  onChangeProductOfferInput: (value, target) => void;
  onClickProductOfferSubmit: () => void;
  onRequestModalClose: () => void;
}

class MessageProductOfferModalView extends Component<MessageProductOfferModalViewProps, {}> {
  render() {
    return (
      <RayonModalView isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onRequestModalClose}>
        <ModalTitle
          className={styles.noticeTitle}
          title={'Product Offer'}
          onCloseRequest={this.props.onRequestModalClose}
        />
        <TextInput
          className={styles.offerModalInput}
          title={FinanceProductType.getFinanceProductNames(FinanceProductType.amount)}
          onChangeInputValue={amount => this.props.onChangeProductOfferInput(amount, FinanceProductType.amount)}
        />
        <TextInput
          className={styles.offerModalInput}
          title={FinanceProductType.getFinanceProductNames(FinanceProductType.interest)}
          onChangeInputValue={interest => this.props.onChangeProductOfferInput(interest, FinanceProductType.interest)}
        />
        <TextInput
          className={styles.offerModalInput}
          title={FinanceProductType.getFinanceProductNames(FinanceProductType.maturity)}
          onChangeInputValue={maturity => this.props.onChangeProductOfferInput(maturity, FinanceProductType.maturity)}
        />
        <RayonButton
          className={styles.sendOfferBtn}
          title={'Submit'}
          onClickButton={this.props.onClickProductOfferSubmit}
          buttonColor={RAYON_BERRY}
        />
      </RayonModalView>
    );
  }
}

export default MessageProductOfferModalView;
