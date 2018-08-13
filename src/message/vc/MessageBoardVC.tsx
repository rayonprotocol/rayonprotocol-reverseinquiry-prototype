import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import AuctionMessage from 'message/model/AuctionMessage';
import AuctionContent from 'auction/model/Auction';
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogSendAuctionMessageArgs } from 'common/model/RayonEvent';

// dc
import MessageDC from 'message/dc/MessageDC';
import AuctionDC from 'auction/dc/AuctionDC';
import UserDC from 'user/dc/UserDC';

// util
import history from 'common/util/Histroy';
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './MessageBoardVC.scss';

interface MessageBoardVCState {
  auctionContents: AuctionContent[];
  auctionMessages: Map<number, AuctionMessage[]>;
  isLoadingComplete: boolean;
  user: User;
}

class MessageBoardVC extends Component<{}, MessageBoardVCState> {
  state = {
    ...this.state,
    user: UserDC.getUser(),
  };

  async componentWillMount() {
    AuctionDC.addAuctionContentsListeners(this.onAuctionContentsFetched.bind(this));
    MessageDC.addAuctionMessagesListeners(this.onAuctionMessagesFetched.bind(this));
    MessageDC.addEventListener(RayonEvent.LogSendAuctionMessage, this.onAuctionMessageSent.bind(this));
    AuctionDC.fetchAuctionContents();
  }

  componentWillUnmount() {
    AuctionDC.removeEventListener(RayonEvent.LogRegisterAuctionContent, this.onAuctionMessageSent.bind(this));
    AuctionDC.removeAuctionContentsListeners(this.onAuctionContentsFetched.bind(this));
    MessageDC.removeAuctionMessagesListeners(this.onAuctionMessagesFetched.bind(this));
  }

  onAuctionContentsFetched(auctionContents: AuctionContent[]) {
    MessageDC.fetchAuctionMessages(auctionContents);
    this.setState({ ...this.state, auctionContents });
  }

  onAuctionMessagesFetched(auctionMessages: Map<number, AuctionMessage[]>) {
    this.setState({ ...this.state, auctionMessages, isLoadingComplete: true });
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

  onClickTitle(id: number) {
    history.push(`/message/content/${id}`);
  }

  getLatestMessage(messages: AuctionMessage[]) {
    if (messages === undefined || messages.length === 0) return; // 아무 메세지도 도착하지 않은 경우

    const message: AuctionMessage = messages[0];
    const { user } = this.state;
    const borrowerMsgTypeNames = [
      'Received Data Request',
      'Sent Data',
      'Offer Received',
      'Accepted Offer',
      'Rejected Offer',
    ];
    const lenderMsgTypeNames = ['Requested Data', 'Received Data', 'Loan Offered', 'Accepted Offer', 'Rejected Offer'];
    const tagMsg = this.state.user.isBorrower
      ? borrowerMsgTypeNames[message.msgType - 1]
      : lenderMsgTypeNames[message.msgType - 1];

    return (
      <p
        className={classNames(styles.tag, {
          [styles.borrower]: user.isBorrower,
          [styles.lender]: !user.isBorrower,
          [styles.rejected]: tagMsg === 'Rejected Offer',
        })}
      >
        {tagMsg}
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
                        <Link to={`/message/content/${auctionContent.id}`}>{auctionContent.title}</Link>
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
