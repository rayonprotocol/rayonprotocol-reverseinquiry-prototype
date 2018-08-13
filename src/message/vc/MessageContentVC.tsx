import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

// model
import AuctionMessage, { MsgTypes } from 'message/model/AuctionMessage';
import { RayonEvent, RayonEventResponse, LogSendAuctionMessageArgs } from 'common/model/RayonEvent';
import AuctionContent from 'auction/model/Auction';
import User from 'user/model/User';

// dc
import MessageDC from '../dc/MessageDC';
import AuctionDC from 'auction/dc/AuctionDC';
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
  auctionContent: AuctionContent;
  auctionMessage: AuctionMessage[];
  auctionId: number;
  productOfferInput: string[];
  isModalOpen: boolean;
  isLoadingComplete: boolean;
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

  //   async componentWillMount() {
  //     const {
  //       match: { params },
  //     } = this.props;
  //     const contentIndex = parseInt(params.id);
  //     // const messages = await MessageDC.getUserMessages();
  //     // this.setState({ ...this.state, messages, contentIndex });
  //   }

  async componentWillMount() {
    const {
      match: { params },
    } = this.props;

    AuctionDC.addAuctionContentsListeners(this.onAuctionContentsFetched.bind(this));
    MessageDC.addAuctionMessagesListeners(this.onAuctionMessagesFetched.bind(this));
    MessageDC.addEventListener(RayonEvent.LogSendAuctionMessage, this.onAuctionMessageSent.bind(this));

    this.setState({ ...this.state, contentIndex: parseInt(params.id) }, () => {
      AuctionDC.fetchAuctionContents();
    });
  }

  componentWillUnmount() {
    AuctionDC.removeEventListener(RayonEvent.LogRegisterAuctionContent, this.onAuctionMessageSent.bind(this));
    AuctionDC.removeAuctionContentsListeners(this.onAuctionContentsFetched.bind(this));
    MessageDC.removeAuctionMessagesListeners(this.onAuctionMessagesFetched.bind(this));
  }

  onAuctionContentsFetched(auctionContents: AuctionContent[]) {
    const auctionContent = auctionContents.find(content => content.id === this.state.contentIndex);
    MessageDC.fetchAuctionMessages(auctionContents);
    this.setState({ ...this.state, auctionContent });
  }

  onAuctionMessagesFetched(auctionMessages: Map<number, AuctionMessage[]>) {
    this.setState({ ...this.state, auctionMessage: auctionMessages[this.state.contentIndex], isLoadingComplete: true });
  }

  onAuctionMessageSent(event: RayonEventResponse<LogSendAuctionMessageArgs>) {
    const { auctionMessages } = this.state;
    const newAuctionMessage: AuctionMessage = {
      auctionId: event.args.auctionId.toNumber(),
      messageId: event.args.messageId.toNumber(),
      fromAddress: event.args.fromAddress,
      toAddress: event.args.toAddress,
      msgType: event.args.msgType.toNumber(),
      payload: event.args.payload,
      timeStamp: event.args.timeStamp,
      isComplete: event.args.isComplete,
    };
    auctionMessages[newAuctionMessage.auctionId].push(newAuctionMessage);
    this.setState({ ...this.state, auctionMessages });
  }

  onClickDataSubmit(message: AuctionMessage) {
    const requestFinanceDataKey = message.payload.split('%%');
    const requestResponeceData = {};
    const localFinanceData = JSON.parse(localStorage.getItem(MessageDC.getUserAccount()));
    requestFinanceDataKey.forEach(item => {
      requestResponeceData[item] = localFinanceData[item];
    });
    if (localFinanceData === null) return alert('Register your personal data first!');
    MessageDC.sendMessage(
      message.fromAddress,
      message.auctionId,
      MsgTypes.RESPONSE_PERSONAL_DATA,
      message.messageId,
      JSON.stringify(requestResponeceData)
    );
  }

  onClickOfferAccept(message: AuctionMessage) {
    MessageDC.sendMessage(message.fromAddress, message.auctionId, MsgTypes.ACCEPT_OFFER, message.messageId, 'true');
  }

  onClickOfferDeny(message: AuctionMessage) {
    MessageDC.sendMessage(message.fromAddress, message.auctionId, MsgTypes.DENY_OFFER, message.messageId, 'false');
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isModalOpen: false });
  }

  onClickOpenModal() {
    this.setState({ ...this.state, isModalOpen: true });
  }

  //   onClickOfferSubmit() {
  //     const data = this.state.productOfferInput.join('##');
  //     const message:AuctionMessage = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex)[0];
  //     MessageDC.sendMessage(message.fromAddress, message.auctionId, MsgTypes.OFFER_PRODUCT, message.messageId, data);
  //     this.setState({ ...this.state, isModalOpen: false });
  //   }

  onChangeProductOfferInput(event, index) {
    let { productOfferInput } = this.state;
    productOfferInput[index] = event.target.value;
    this.setState({ ...this.state, productOfferInput });
  }

  renderMessageType = (msgType: MsgTypes, isLatestMsg?: boolean) => {
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
        <p>{this.state.user.isBorrower ? borrowerMsgTypeNames[msgType - 1] : lenderMsgTypeNames[msgType - 1]}</p>
        {isLatestMsg &&
          msgType === MsgTypes.OFFER_PRODUCT && <img src={require('../../common/asset/img/offer-recieved.png')} />}
        {isLatestMsg &&
          msgType === MsgTypes.ACCEPT_OFFER && <img src={require('../../common/asset/img/accept-offer.png')} />}
      </div>
    );
  };

  renderSpecialForm(message: AuctionMessage) {
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

  onClickTitle() {
    history.goBack();
  }

  render() {
    const { auctionContent, auctionMessage, isLoadingComplete } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          {!isLoadingComplete ? (
            <div>Loading...</div>
          ) : (
            // <div>loaded</div>
            <div>
              <div className={styles.goBackTitle} onClick={this.onClickTitle}>
                {'<   ' + auctionContent.title}
              </div>
              {auctionMessage.length === 0 ? (
                <div>No Messages</div>
              ) : (
                auctionMessage.map((item, index) => {
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
                        <ThreeValueText title={'From'} firstValue={item.fromUserID} secondValue={item.fromAddress} />
                        <ThreeValueText title={'to'} firstValue={item.toUserID} secondValue={item.toAddress} />
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
          {/* <RayonButton
            className={styles.sendOfferBtn}
            title={'Submit'}
            onClickButton={this.onClickOfferSubmit.bind(this)}
            isBorrower={false}
          /> */}
        </RayonModalView>
      </Fragment>
    );
  }
}

export default MessageContentVC;
