import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

// model
import { RAYON_BERRY, RAYON_LAKE, RAYON_DARKBERRY, RAYON_DARKLAKE } from 'common/model/Style';
import Message, { MsgTypes, FinanceProductType } from 'message/model/Message';
import User from 'user/model/User';

// view
import TagView from 'common/view/text/TagView';
import RayonButton from 'common/view/button/RayonButton';
import ThreeValueText from 'common/view/text/ThreeValueText';

// util
import ArrayUtil from 'common/util/ArrayUtil';
import history from 'common/util/Histroy';

// styles
import styles from './MessageContentView.scss';

interface MessageContentViewProps {
  user: User;
  messages: Message[];
  onRequestModalOpenStateToggle: () => void;
  onResponseFinanceData: (message: Message) => void;
  onClickProductRejectOrAccept: (message: Message, msgType: MsgTypes) => void;
}

class MessageContentView extends Component<MessageContentViewProps, {}> {
  renderMessageType = (msgType: MsgTypes, isLastMsg?: boolean) => {
    const MsgName = this.props.user.isBorrower
      ? MsgTypes.getBorrowerMsgNames(msgType)
      : MsgTypes.getLenderMsgNames(msgType);

    return (
      <div className={styles.messageType}>
        <p style={{ color: this.props.user.isBorrower ? RAYON_DARKLAKE : RAYON_DARKBERRY }}>{MsgName}</p>
        {isLastMsg &&
          msgType === MsgTypes.OFFER_PRODUCT && <img src={require('../../common/asset/img/offer-recieved.png')} />}
        {isLastMsg &&
          msgType === MsgTypes.ACCEPT_OFFER && <img src={require('../../common/asset/img/accept-offer.png')} />}
      </div>
    );
  };

  renderPayload(msgType: MsgTypes, payload: string) {
    switch (msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return payload.split('%%').map((tag, index) => {
          return <TagView key={index} tag={tag} color={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY} />;
        });
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const financeData = JSON.parse(payload);
        return Object.keys(JSON.parse(payload)).map((tag, index) => {
          return (
            <TagView
              key={index}
              tag={tag + ':' + financeData[tag]}
              color={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          );
        });
      case MsgTypes.OFFER_PRODUCT:
        console.log('payload', payload);
        return payload.split('##').map((tag, index) => {
          return (
            <TagView
              key={index}
              tag={FinanceProductType.getFinanceProductNames(index) + tag}
              color={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          );
        });
      case MsgTypes.ACCEPT_OFFER:
        if (this.props.user.isBorrower) {
          return (
            <div className={styles.complete}>
              <div className={styles.note}>
                Thank you for choosing our offer. You can sign up for your product by clicking on the link below
              </div>
              <RayonButton
                className={styles.productLinkBtn}
                title={'Product Link'}
                onClickButton={() => history.goBack()}
                buttonColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
              />
            </div>
          );
        }
      default:
        return;
    }
  }

  renderSpecialForm(message: Message) {
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          <RayonButton
            className={styles.messageBtn}
            title={'Send Data'}
            onClickButton={() => this.props.onResponseFinanceData(message)}
            isHidden={!this.props.user.isBorrower}
            buttonColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
          />
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        return (
          <RayonButton
            className={styles.messageBtn}
            title={'Send Offer'}
            onClickButton={this.props.onRequestModalOpenStateToggle}
            isHidden={this.props.user.isBorrower}
            buttonColor={RAYON_BERRY}
          />
        );
      case MsgTypes.OFFER_PRODUCT:
        return (
          <div className={styles.offerChoiceBlock}>
            <RayonButton
              className={classNames(styles.messageBtn, styles.rejectBtn)}
              title={'Reject'}
              onClickButton={() => this.props.onClickProductRejectOrAccept(message, MsgTypes.REJECT_OFFER)}
              isHidden={!this.props.user.isBorrower}
              buttonColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
            <RayonButton
              className={classNames(styles.messageBtn, styles.acceptBtn)}
              title={'Accept'}
              onClickButton={() => this.props.onClickProductRejectOrAccept(message, MsgTypes.ACCEPT_OFFER)}
              isHidden={!this.props.user.isBorrower}
              buttonColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          </div>
        );
      default:
        break;
    }
  }

  render() {
    return (
      <Fragment>
        {ArrayUtil.isEmpty(this.props.messages) ? (
          <div>No Messages</div>
        ) : (
          this.props.messages.map((item, index) => {
            return (
              <div
                key={index}
                className={classNames(styles.message, {
                  [styles.latestBorrowerMessage]:
                    index === 0 &&
                    this.props.user.isBorrower &&
                    (item.msgType === MsgTypes.ACCEPT_OFFER || item.msgType === MsgTypes.OFFER_PRODUCT),
                  [styles.latestLenderMessage]:
                    index === 0 &&
                    !this.props.user.isBorrower &&
                    (item.msgType === MsgTypes.ACCEPT_OFFER || item.msgType === MsgTypes.OFFER_PRODUCT),
                })}
              >
                <div className={classNames(styles.messageBody)}>
                  {this.renderMessageType(item.msgType, index === 0)}
                  <ThreeValueText title={'From'} firstValue={''} secondValue={item.fromAddress} />
                  <ThreeValueText title={'to'} firstValue={''} secondValue={item.toAddress} />
                  {this.renderPayload(item.msgType, item.payload)}
                </div>
                {!item.isComplete && this.renderSpecialForm(item)}
              </div>
            );
          })
        )}
      </Fragment>
    );
  }
}

export default MessageContentView;
