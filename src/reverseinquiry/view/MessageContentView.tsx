import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

// model
import { RAYON_BERRY, RAYON_LAKE, RAYON_DARKBERRY, RAYON_DARKLAKE } from 'common/model/Style';
import Message, { MsgTypes, FinanceProductType } from 'reverseinquiry/model/Message';
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

  rendercontent(msgType: MsgTypes, content: string) {
    switch (msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return content.split('%%').map((tag, index) => {
          return <TagView key={index} tag={tag} tagColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY} />;
        });
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const financeData = JSON.parse(content);
        return Object.keys(JSON.parse(content)).map((tag, index) => {
          return (
            <TagView
              key={index}
              tag={tag + ':' + financeData[tag]}
              tagColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          );
        });
      case MsgTypes.OFFER_PRODUCT:
        console.log('content', content);
        return content.split('##').map((tag, index) => {
          return (
            <TagView
              key={index}
              tag={FinanceProductType.getFinanceProductNames(index) + tag}
              tagColor={this.props.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
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

  renderButtonForm(message: Message) {
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

  isImageMessageType(msgType: number) {
    return msgType === MsgTypes.ACCEPT_OFFER || msgType === MsgTypes.OFFER_PRODUCT;
  }

  render() {
    return (
      <Fragment>
        {ArrayUtil.isEmpty(this.props.messages) ? (
          <div>No Messages</div>
        ) : (
          this.props.messages.map((message, index) => {
            return (
              <div
                key={index}
                className={classNames(styles.message, {
                  [styles.latestBorrowerMessage]:
                    index === 0 && this.props.user.isBorrower && this.isImageMessageType(message.msgType),
                  [styles.latestLenderMessage]:
                    index === 0 && !this.props.user.isBorrower && this.isImageMessageType(message.msgType),
                })}
              >
                <div className={styles.messageBody}>
                  {this.renderMessageType(message.msgType, index === 0)}
                  <ThreeValueText title={'From'} firstValue={''} secondValue={message.fromAddress} />
                  <ThreeValueText title={'to'} firstValue={''} secondValue={message.toAddress} />
                  {this.rendercontent(message.msgType, message.content)}
                </div>
                {!message.isComplete && this.renderButtonForm(message)}
              </div>
            );
          })
        )}
      </Fragment>
    );
  }
}

export default MessageContentView;
