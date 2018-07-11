import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';

// model
import Message, { MsgTypes } from 'message/model/Message';
import User from 'user/model/User';

// dc
import ContractDC from 'common/dc/ContractDC';
import MessageDC from '../dc/MessageDC';
import AuctionDC from 'auction/dc/AuctionDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import ThreeValueText from 'common/view/text/ThreeValueText';
import CommonRayonButton from 'common/view/button/CommonRayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';
import ModalTitle from 'common/view/modal/ModalTitle';
import CommonTextInput from 'common/view/input/CommonTextInput';

// util
import history from 'common/util/Histroy';

// styles
import styles from './MessageContentVC.scss';

interface MessageContentVCProps {
  match: any;
}

interface MessageContentVCState {
  messages: Message[];
  contentIndex: number;
  productOfferInput: string[];
  isModalOpen: boolean;
  user: User;
}

class MessageContentVC extends Component<MessageContentVCProps, MessageContentVCState> {
  state = {
    ...this.state,
    messages: [],
    user: UserDC.getUser(),
    isModalOpen: false,
    productOfferInput: ['', '', ''],
  };

  async componentWillMount() {
    const {
      match: { params },
    } = this.props;
    const contentIndex = parseInt(params.id);
    const messages = await MessageDC.getUserMessages();
    this.setState({ ...this.state, messages, contentIndex });
  }

  onClickDataSubmit(message: Message) {
    const requestFinanceDataKey = message.payload.split('%%');
    const requestResponeceData = {};
    const localFinanceData = JSON.parse(localStorage.getItem(ContractDC.getAccount()));
    requestFinanceDataKey.forEach(item => {
      requestResponeceData[item] = localFinanceData[item];
    });
    if (localFinanceData === null) return alert('Register your personal data first!');
    MessageDC.insertMessage(
      message.fromAddress,
      message.auctionId,
      MsgTypes.RESPONSE_PERSONAL_DATA,
      message.msgIndex,
      JSON.stringify(requestResponeceData)
    );
  }

  onClickOfferAccept(message: Message) {
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.ACCEPT_OFFER, message.msgIndex, 'true');
  }

  onClickOfferDeny(message: Message) {
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.DENY_OFFER, message.msgIndex, 'false');
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isModalOpen: false });
  }

  onClickOpenModal() {
    this.setState({ ...this.state, isModalOpen: true });
  }

  onClickOfferSubmit() {
    const data = this.state.productOfferInput.join('##');
    const message = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex)[0];
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.OFFER_PRODUCT, message.msgIndex, data);
    this.setState({ ...this.state, isModalOpen: false });
  }

  onChangeProductOfferInput(event, index) {
    let { productOfferInput } = this.state;
    productOfferInput[index] = event.target.value;
    this.setState({ ...this.state, productOfferInput });
  }

  renderMessageType = (msgType: MsgTypes) => {
    const borrowerMsgTypeNames = [
      'Received Data Request',
      'Sent Data',
      'Offer Received',
      'Accepted Offer',
      'Rejected Offer',
    ];
    const lenderMsgTypeNames = ['Requested Data', 'Received Data', 'Loan Offered', 'Accepted Offer', 'Rejected Offer'];
    const user = UserDC.getUser();
    return (
      <div
        className={classNames(styles.messageType, {
          [styles.borrower]: user.isBorrower,
          [styles.lender]: !user.isBorrower,
        })}
      >
        {this.state.user.isBorrower ? borrowerMsgTypeNames[msgType - 1] : lenderMsgTypeNames[msgType - 1]}
      </div>
    );
  };

  renderSpecialForm(message: Message) {
    const user = UserDC.getUser();
    const isBorrower = user.isBorrower;
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          isBorrower && (
            <CommonRayonButton
              className={styles.messageBtn}
              title={'Send Data'}
              onClickButton={() => this.onClickDataSubmit(message)}
              isBorrower={isBorrower}
            />
          )
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        return (
          !isBorrower && (
            <CommonRayonButton
              className={styles.messageBtn}
              title={'Send Offer'}
              onClickButton={this.onClickOpenModal.bind(this)}
              isBorrower={isBorrower}
            />
          )
        );
      case MsgTypes.OFFER_PRODUCT:
        return (
          isBorrower && (
            <div className={styles.offerChoiceBlock}>
              <CommonRayonButton
                className={classNames(styles.messageBtn, styles.rejectBtn)}
                title={'Reject'}
                onClickButton={() => this.onClickOfferDeny(message)}
                isBorrower={isBorrower}
              />
              <CommonRayonButton
                className={classNames(styles.messageBtn, styles.acceptBtn)}
                title={'Accept'}
                onClickButton={() => this.onClickOfferAccept(message)}
                isBorrower={isBorrower}
              />
            </div>
          )
        );
      default:
        break;
    }
  }

  renderPayloadTag(item: string, index: number) {
    const user = UserDC.getUser();
    return (
      <div
        className={classNames(styles.tag, { [styles.borrower]: user.isBorrower, [styles.lender]: !user.isBorrower })}
        key={index}
      >
        {item}
      </div>
    );
  }

  renderPayload(msgType: MsgTypes, payload: string) {
    const user = UserDC.getUser();
    switch (msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        const offeredData = payload.split('%%');
        return offeredData.map((item, index) => {
          return this.renderPayloadTag(item, index);
        });
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const financeData = JSON.parse(payload);
        return Object.keys(financeData).map((item, index) => {
          return this.renderPayloadTag(item + ':' + financeData[item], index);
        });
      case MsgTypes.OFFER_PRODUCT:
        const offeredProductData = payload.split('##');
        const prefixStr = ['Amount', 'Interest', 'Maturity'];
        return offeredProductData.map((item, index) => {
          return this.renderPayloadTag(prefixStr[index] + ':' + item, index);
        });
      case MsgTypes.ACCEPT_OFFER:
        return (
          <div className={styles.complete}>
            <div className={styles.note}>
              Thank you for choosing our offer. You can sign up for your product by clicking on the link below
            </div>
            <CommonRayonButton
              className={styles.productLinkBtn}
              title={'Product Link'}
              onClickButton={() => history.goBack()}
              isBorrower={user.isBorrower}
            />
          </div>
        );
      default:
        return;
    }
  }

  onClickTitle() {
    history.goBack();
  }

  render() {
    const messages = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex);
    const content = AuctionDC.getAuctionContentByIndex(this.state.contentIndex);
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          {content && (
            <div className={styles.goBackTitle} onClick={this.onClickTitle}>
              {'<   ' + content.title}
            </div>
          )}
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            messages.map((item, index) => {
              return (
                <div key={index} className={classNames(styles.message)}>
                  <div
                    className={classNames(styles.messageBody, {
                      [styles.latestMessage]:
                        index === 0 &&
                        (item.msgType === MsgTypes.ACCEPT_OFFER || item.msgType === MsgTypes.OFFER_PRODUCT),
                    })}
                  >
                    {this.renderMessageType(item.msgType)}
                    <ThreeValueText title={'From'} firstValue={item.fromUserID} secondValue={item.fromAddress} />
                    <ThreeValueText title={'to'} firstValue={item.toUserID} secondValue={item.toAddress} />
                    {this.renderPayload(item.msgType, item.payload)}
                  </div>
                  {!item.isComplete && this.renderSpecialForm(item)}
                </div>
              );
            })
          )}
        </Container>
        <RayonModalView isModalOpen={this.state.isModalOpen} onRequestClose={this.onRequestCloseModal.bind(this)}>
          <ModalTitle
            className={styles.noticeTitle}
            title={'Product Offer'}
            onCloseRequest={this.onRequestCloseModal.bind(this)}
          />
          <CommonTextInput
            className={styles.offerModalInput}
            title={'Amount'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 0)}
          />
          <CommonTextInput
            className={styles.offerModalInput}
            title={'Interest'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 1)}
          />
          <CommonTextInput
            className={styles.offerModalInput}
            title={'Maturity'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 2)}
          />
          <CommonRayonButton
            className={styles.sendOfferBtn}
            title={'Submit'}
            onClickButton={this.onClickOfferSubmit.bind(this)}
            isBorrower={false}
          />
        </RayonModalView>
      </Fragment>
    );
  }
}

export default MessageContentVC;
