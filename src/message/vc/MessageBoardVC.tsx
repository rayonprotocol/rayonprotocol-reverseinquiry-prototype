import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import Message, { MsgTypes } from 'message/model/Message';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogSendReverseInquiryMessageArgs } from 'common/model/RayonEvent';

// dc
import MessageDC from 'message/dc/MessageDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// util
import history from 'common/util/Histroy';
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './MessageBoardVC.scss';

interface MessageBoardVCState {
  reverseInquiries: ReverseInquiry[];
  messages: Map<number, Message[]>;
  isLoadingComplete: boolean;
  user: User;
}

class MessageBoardVC extends Component<{}, MessageBoardVCState> {
  state = {
    ...this.state,
    user: UserDC.getUser(),
  };

  async componentWillMount() {
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched.bind(this));
    MessageDC.addMessagesListeners(this.onReverseInquiryMessagesFetched.bind(this));
    MessageDC.addEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onReverseInquiryMessageSent.bind(this));
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeEventListener(
      RayonEvent.LogRegisterReverseInquiry,
      this.onReverseInquiryMessageSent.bind(this)
    );
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched.bind(this));
    MessageDC.removeMessagesListeners(this.onReverseInquiryMessagesFetched.bind(this));
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]) {
    MessageDC.fetchMessages(reverseInquiries);
    this.setState({ ...this.state, reverseInquiries });
  }

  onReverseInquiryMessagesFetched(Messages: Map<number, Message[]>) {
    this.setState({ ...this.state, Messages, isLoadingComplete: true });
  }

  onReverseInquiryMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>) {
    const { reverseInquiryMessages } = this.state;
    const newReverseInquiryMessage: Message = {
      reverseInquiryId: event.args.reverseInquiryId.toNumber(),
      messageId: event.args.messageId.toNumber(),
      fromAddress: event.args.fromAddress,
      toAddress: event.args.toAddress,
      msgType: event.args.msgType.toNumber(),
      payload: event.args.payload,
      timeStamp: event.args.timeStamp,
      isComplete: event.args.isComplete,
    };
    reverseInquiryMessages[newReverseInquiryMessage.reverseInquiryId].push(newReverseInquiryMessage);
    this.setState({ ...this.state, reverseInquiryMessages });
  }

  onClickTitle(id: number) {
    history.push(`/message/content/${id}`);
  }

  getLatestMessage(messages: Message[]) {
    if (messages === undefined || messages.length === 0) return; // 아무 메세지도 도착하지 않은 경우

    const message: Message = messages[0];
    const { user } = this.state;
    const MsgName = this.state.user.isBorrower
      ? MsgTypes.getBorrowerMsgNames(message.msgType)
      : MsgTypes.getLenderMsgNames(message.msgType);

    return (
      <p
        className={classNames(styles.tag, {
          [styles.borrower]: user.isBorrower,
          [styles.lender]: !user.isBorrower,
          [styles.rejected]: MsgName === MsgTypes.getBorrowerMsgNames(MsgTypes.REJECT_OFFER),
        })}
      >
        {MsgName}
      </p>
    );
  }

  render() {
    const { auctionContents, auctionMessages, isLoadingComplete, user } = this.state;
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Mailbox</p>
          </div>
          {!isLoadingComplete ? (
            <div>Loading...</div>
          ) : auctionContents === undefined ? (
            <div
              className={classNames(styles.emptyNote, {
                [styles.borrower]: user.isBorrower,
                [styles.lender]: !user.isBorrower,
              })}
            >
              No Message
            </div>
          ) : (
            <div className={styles.contentTable}>
              {auctionContents.map((auctionContent, index) => {
                return (
                  <div key={index} className={styles.contentRow}>
                    <div className={styles.contentNumber}>
                      <p>{auctionContent.id + 1}</p>
                    </div>
                    <div className={styles.rightSection}>
                      <div className={styles.contentsTitle}>
                        <Link to={`/message/content?id=${auctionContent.id}`}>{auctionContent.title}</Link>
                      </div>
                      <div className={styles.bottomSection}>
                        {this.getLatestMessage(auctionMessages[auctionContent.id])}
                        <p className={styles.timeColumn}>{TimeConverter(auctionContent.timeStamp)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default MessageBoardVC;
