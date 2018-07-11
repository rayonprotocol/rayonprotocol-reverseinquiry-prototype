import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import Message, { MsgTypes } from 'message/model/Message';
import Auction from 'auction/model/Auction';
import User from 'user/model/User';

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
  messages: Object;
  auctionContents: Auction[];
  isLoading: boolean;
  user: User;
}

class MessageBoardVC extends Component<{}, MessageBoardVCState> {
  state = {
    ...this.state,
    messages: {},
    auctionContents: [],
    isLoading: true,
    user: UserDC.getUser(),
  };

  async componentWillMount() {
    await AuctionDC.getContentList();
    await MessageDC.getUserMessages();
    const auctionContents = await MessageDC.getUserAuctionContents();
    const messages = MessageDC.getSortedMessageByAuctionContent();
    this.setState({ ...this.state, messages, auctionContents, user: UserDC.getUser(), isLoading: false });
  }

  onClickTitle(id: number) {
    history.push(`/message/content/${id}`);
  }

  getLatestMessage(message: Message) {
    if (message === undefined) return; // 아무 메세지도 도착하지 않은 경우
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
    const { messages, auctionContents, isLoading, user } = this.state;
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Mailbox</p>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : auctionContents.length === 0 ? (
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
              {auctionContents.map((item, index) => {
                return (
                  <div key={index} className={styles.contentRow}>
                    <div className={styles.contentNumber}>
                      <p>{item.id + 1}</p>
                    </div>
                    <div className={styles.rightSection}>
                      <div className={styles.contentsTitle}>
                        <Link to={`/message/content/${item.id}`}>{item.title}</Link>
                      </div>
                      <div className={styles.bottomSection}>
                        {this.getLatestMessage(messages[item.id])}
                        <p className={styles.timeColumn}>{TimeConverter(item.timeStamp)}</p>
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
