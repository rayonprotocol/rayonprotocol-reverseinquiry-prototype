import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// model
import User from 'user/model/User';
import { RAYON_DARKLAKE, RAYON_DARKBERRY, RAYON_DEEPGRAY } from 'common/model/Style';
import Message, { MsgTypes } from 'message/model/Message';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogSendReverseInquiryMessageArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';
import MessageDC from 'message/dc/MessageDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';

// util
import ArrayUtil from 'common/util/ArrayUtil';
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './MessageBoardVC.scss';

interface MessageBoardVCState {
  reverseInquiries: ReverseInquiry[];
  messages: Map<number, Message[]>;
  isLoading: boolean;
  user: User;
}

class MessageBoardVC extends Component<{}, MessageBoardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      messages: new Map<number, Message[]>(),
      user: UserDC.getUser(),
      isLoading: true,
    };
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
    this.onReverseInquiryMessagesFetched = this.onReverseInquiryMessagesFetched.bind(this);
    this.onReverseInquiryMessageSent = this.onReverseInquiryMessageSent.bind(this);
  }

  async componentWillMount() {
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    MessageDC.addMessagesListeners(this.onReverseInquiryMessagesFetched);
    MessageDC.addEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onReverseInquiryMessageSent);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeEventListener(RayonEvent.LogRegisterReverseInquiry, this.onReverseInquiryMessageSent);
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
    MessageDC.removeMessagesListeners(this.onReverseInquiryMessagesFetched);
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]) {
    MessageDC.fetchMessages(reverseInquiries);
    this.setState({ ...this.state, reverseInquiries });
  }

  onReverseInquiryMessagesFetched(messages: Map<number, Message[]>) {
    this.setState({ ...this.state, messages, isLoading: false });
  }

  onReverseInquiryMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>) {
    console.log('event', event);
    const newReverseInquiryMessage: Message = {
      reverseInquiryId: event.args.reverseInquiryId.toNumber(),
      messageId: event.args.messageId.toNumber(),
      fromAddress: event.args.fromAddress,
      toAddress: event.args.toAddress,
      msgType: event.args.msgType.toNumber(),
      payload: event.args.payload,
      timeStamp: event.args.insertTime,
      isComplete: event.args.isComplete,
    };
    this.state.messages[newReverseInquiryMessage.reverseInquiryId].push(newReverseInquiryMessage);
    this.setState({ ...this.state, messages: this.state.messages });
  }

  getLatestMessage(messages: Message[]) {
    if (ArrayUtil.isEmpty(messages)) return;

    const message: Message = messages[0];
    const textColor = this.state.user.isBorrower ? RAYON_DARKLAKE : RAYON_DARKBERRY;
    const MsgName = this.state.user.isBorrower
      ? MsgTypes.getBorrowerMsgNames(message.msgType)
      : MsgTypes.getLenderMsgNames(message.msgType);

    return (
      <p className={styles.tag} style={{ color: this.isRejectMessage(MsgName) ? RAYON_DEEPGRAY : textColor }}>
        {MsgName}
      </p>
    );
  }

  isRejectMessage(MsgName: string) {
    return MsgName === MsgTypes.getBorrowerMsgNames(MsgTypes.REJECT_OFFER);
  }

  renderNoMessage() {
    return (
      <div
        className={styles.emptyNote}
        style={{ color: this.state.user.isBorrower ? RAYON_DARKLAKE : RAYON_DARKBERRY }}
      >
        No Message
      </div>
    );
  }

  renderMessageTable() {
    return (
      <div className={styles.contentTable}>
        {this.state.reverseInquiries.map((reverseInquiry, index) => {
          return (
            <div key={index} className={styles.contentRow}>
              <div className={styles.contentNumber}>
                <p>{reverseInquiry.id + 1}</p>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.contentsTitle}>
                  <Link to={`/message/content?id=${reverseInquiry.id}`}>{reverseInquiry.title}</Link>
                </div>
                <div className={styles.bottomSection}>
                  {this.getLatestMessage(this.state.messages[reverseInquiry.id])}
                  <p className={styles.timeColumn}>{TimeConverter(reverseInquiry.insertTime)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Mailbox</p>
          </div>
          {this.state.isLoading ? (
            <div>Loading...</div>
          ) : ArrayUtil.isEmpty(this.state.reverseInquiries) ? (
            this.renderNoMessage()
          ) : (
            this.renderMessageTable()
          )}
        </Container>
      </Fragment>
    );
  }
}

export default MessageBoardVC;
