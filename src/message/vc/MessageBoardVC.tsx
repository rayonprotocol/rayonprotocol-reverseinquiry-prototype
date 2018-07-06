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
import Container from 'common/view/Container';
import TopBanner from 'common/view/banner/TopBanner';

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
    const offeredData = message.payload.split('%%').join(', ');
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
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag)}>{tagMsg}</div>
            <div className={styles.subTitleValue}>{offeredData}</div>
          </div>
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const jsonOfferedData = JSON.parse(offeredData);
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.orangeTag)}>{tagMsg}</div>
            {Object.keys(jsonOfferedData).map((item, index) => {
              return (
                <div className={styles.financeData} key={index}>
                  {item} : {jsonOfferedData[item]}
                </div>
              );
            })}
          </div>
        );
      case MsgTypes.OFFER_PRODUCT:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.pupleTag)}>{tagMsg}</div>
          </div>
        );
      case MsgTypes.DENY_OFFER:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.lightgrayTag)}>{tagMsg}</div>
          </div>
        );
      case MsgTypes.ACCEPT_OFFER:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.greenTag)}>{tagMsg}</div>
          </div>
        );
      default:
        break;
    }
  }

  render() {
    const { messages, auctionContents, isLoading } = this.state;
    return (
      <Fragment>
        <TopBanner title={'Mailbox'} description={''} />
        <Container className={styles.contentContainer}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Date</th>
                </tr>
                {auctionContents.map((item, index) => {
                  return (
                    <tr key={index} className={styles.contentRow}>
                      <td>{item.id + 1}</td>
                      <td className={styles.contentsTitle}>
                        <Link to={`/message/content/${item.id}`}>
                          <span className={styles.mailTitle}>{item.title}</span>
                          {this.getLatestMessage(messages[item.id])}
                        </Link>
                      </td>
                      <td className={styles.dateColumn}>{TimeConverter(item.timeStamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default MessageBoardVC;
