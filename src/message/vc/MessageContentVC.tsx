import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import classNames from 'classnames';

// model
import Message, { MsgTypes } from 'message/model/Message';
import { RayonEvent, RayonEventResponse, LogSendReverseInquiryMessageArgs } from 'common/model/RayonEvent';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import User from 'user/model/User';

// dc
import MessageDC from '../dc/MessageDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import ThreeValueText from 'common/view/text/ThreeValueText';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';
import ModalTitle from 'common/view/modal/ModalTitle';
import TextInput from 'common/view/input/TextInput';

// util
import history from 'common/util/Histroy';

// styles
import styles from './MessageContentVC.scss';

interface MessageContentVCProps {
  match: any;
}

interface MessageContentVCState {
  reverseInquiry: ReverseInquiry;
  messages: Message[];
  contentIndex: number;
  productOfferInput: string[];
  isModalOpen: boolean;
  isLoadingComplete: boolean;
  user: User;
}

class MessageContentVC extends Component<MessageContentVCProps, MessageContentVCState> {
  constructor(props) {
    super(props);
    const parsed = qs.parse(props.location.search);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
      productOfferInput: ['', '', ''],
      contentIndex: parseInt(parsed.id),
    };
  }

  async componentWillMount() {
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched.bind(this));
    MessageDC.addMessagesListeners(this.onMessagesFetched.bind(this));
    MessageDC.addEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent.bind(this));
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched.bind(this));
    MessageDC.removeMessagesListeners(this.onMessagesFetched.bind(this));
    MessageDC.removeEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent.bind(this));
  }

  onReverseInquiriesFetched(_reverseInquiries: ReverseInquiry[]) {
    const reverseInquiry = _reverseInquiries.find(content => content.id === this.state.contentIndex);
    MessageDC.fetchMessages(_reverseInquiries);
    this.setState({ ...this.state, reverseInquiry });
  }

  onMessagesFetched(_messages: Map<number, Message[]>) {
    this.setState({
      ...this.state,
      messages: _messages[this.state.contentIndex],
      isLoadingComplete: true,
    });
  }

  onMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>) {
    ReverseInquiryDC.fetchReverseInquiries();
  }

  onClickDataSubmit(message: Message) {
    const requestFinanceDataKey = message.payload.split('%%');
    const requestResponeceData = {};
    const localFinanceData = JSON.parse(localStorage.getItem(MessageDC.getUserAccount()));
    requestFinanceDataKey.forEach(item => {
      requestResponeceData[item] = localFinanceData[item];
    });
    if (localFinanceData === null) return alert('Register your personal data first!');
    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.RESPONSE_PERSONAL_DATA,
      JSON.stringify(requestResponeceData)
    );
  }

  onClickOfferAccept(message: Message) {
    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.ACCEPT_OFFER,
      'true'
    );
  }

  onClickOfferDeny(message: Message) {
    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.REJECT_OFFER,
      'false'
    );
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isModalOpen: false });
  }

  onClickOpenModal() {
    this.setState({ ...this.state, isModalOpen: true });
  }

  onClickOfferSubmit() {
    const data = this.state.productOfferInput.join('##');
    const message = this.state.messages[0];
    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.OFFER_PRODUCT,
      data
    );
    this.setState({ ...this.state, isModalOpen: false });
  }

  onClickTitle() {
    history.goBack();
  }

  onChangeProductOfferInput(event, index) {
    let { productOfferInput } = this.state;
    productOfferInput[index] = event.target.value;
    this.setState({ ...this.state, productOfferInput });
  }

  renderMessageType = (msgType: MsgTypes, isLastMsg?: boolean) => {
    const user = UserDC.getUser();
    const MsgName = this.state.user.isBorrower
      ? MsgTypes.getBorrowerMsgNames(msgType)
      : MsgTypes.getLenderMsgNames(msgType);

    return (
      <div
        className={classNames(styles.messageType, {
          [styles.borrower]: user.isBorrower,
          [styles.lender]: !user.isBorrower,
        })}
      >
        <p>{MsgName}</p>
        {isLastMsg &&
          msgType === MsgTypes.OFFER_PRODUCT && <img src={require('../../common/asset/img/offer-recieved.png')} />}
        {isLastMsg &&
          msgType === MsgTypes.ACCEPT_OFFER && <img src={require('../../common/asset/img/accept-offer.png')} />}
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
            <RayonButton
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
            <RayonButton
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
              <RayonButton
                className={classNames(styles.messageBtn, styles.rejectBtn)}
                title={'Reject'}
                onClickButton={() => this.onClickOfferDeny(message)}
                isBorrower={isBorrower}
              />
              <RayonButton
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
        if (user.isBorrower) {
          return (
            <div className={styles.complete}>
              <div className={styles.note}>
                Thank you for choosing our offer. You can sign up for your product by clicking on the link below
              </div>
              <RayonButton
                className={styles.productLinkBtn}
                title={'Product Link'}
                onClickButton={() => history.goBack()}
                isBorrower={user.isBorrower}
              />
            </div>
          );
        }
      default:
        return;
    }
  }

  render() {
    const user = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          {!this.state.isLoadingComplete ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div className={styles.goBackTitle} onClick={this.onClickTitle}>
                {'<   ' + this.state.reverseInquiry.title}
              </div>
              {this.state.messages.length === 0 ? (
                <div>No Messages</div>
              ) : (
                this.state.messages.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames(styles.message, {
                        [styles.latestBorrowerMessage]:
                          index === 0 &&
                          user.isBorrower &&
                          (item.msgType === MsgTypes.ACCEPT_OFFER || item.msgType === MsgTypes.OFFER_PRODUCT),
                        [styles.latestLenderMessage]:
                          index === 0 &&
                          !user.isBorrower &&
                          (item.msgType === MsgTypes.ACCEPT_OFFER || item.msgType === MsgTypes.OFFER_PRODUCT),
                      })}
                    >
                      <div className={classNames(styles.messageBody)}>
                        {this.renderMessageType(item.msgType, index === 0)}
                        {/* {this} */}
                        <ThreeValueText title={'From'} firstValue={''} secondValue={item.fromAddress} />
                        <ThreeValueText title={'to'} firstValue={''} secondValue={item.toAddress} />
                        {this.renderPayload(item.msgType, item.payload)}
                      </div>
                      {!item.isComplete && this.renderSpecialForm(item)}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </Container>
        <RayonModalView isModalOpen={this.state.isModalOpen} onRequestClose={this.onRequestCloseModal.bind(this)}>
          <ModalTitle
            className={styles.noticeTitle}
            title={'Product Offer'}
            onCloseRequest={this.onRequestCloseModal.bind(this)}
          />
          <TextInput
            className={styles.offerModalInput}
            title={'Amount'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 0)}
          />
          <TextInput
            className={styles.offerModalInput}
            title={'Interest'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 1)}
          />
          <TextInput
            className={styles.offerModalInput}
            title={'Maturity'}
            onChangeInputValue={event => this.onChangeProductOfferInput(event, 2)}
          />
          <RayonButton
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
