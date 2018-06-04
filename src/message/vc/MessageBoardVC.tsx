import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import Message, { MsgTypes } from 'message/model/Message';
import Auction from 'auction/model/Auction';

// dc
import MessageDC from 'message/dc/MessageDC';
import AuctionDC from 'auction/dc/AuctionDC';

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
}

class MessageBoardVC extends Component<{}, MessageBoardVCState> {
  state = {
    ...this.state,
    messages: {},
    auctionContents: [],
    isLoading: true,
  };

  async componentWillMount() {
    await MessageDC.getUserMessages();
    const auctionContents = await AuctionDC.getAuctionContents();
    const messages = MessageDC.getSortedMessageByAuctionContent();
    this.setState({ ...this.state, messages, auctionContents, isLoading: false });
  }

  onClickTitle(id: number) {
    history.push(`/message/content/${id}`);
  }

  getLatestMessage(message: Message) {
    if (message === undefined) return; // 아무 메세지도 도착하지 않은 경우
    const offeredData = message.payload.split('%%').join(', ');
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag)}>{'데이터요청'}</div>
            <div className={styles.subTitleValue}>{offeredData}</div>
          </div>
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const jsonOfferedData = JSON.parse(offeredData);
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.orangeTag)}>{'데이터응답'}</div>
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
            <div className={classNames(styles.tag, styles.pupleTag)}>{'상품제안'}</div>
          </div>
        );
      case MsgTypes.DENY_OFFER:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.lightgrayTag)}>{'제안거절'}</div>
          </div>
        );
      case MsgTypes.ACCEPT_OFFER:
        return (
          <div className={styles.mailSubTitle}>
            <div className={classNames(styles.tag, styles.greenTag)}>{'제안수락'}</div>
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
        <TopBanner title={'메세지함'} description={'회원님의 메세지 이력입니다'} />
        <Container className={styles.contentContainer}>
          {isLoading ? (
            <div>로딩중입니다</div>
          ) : (
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성일</th>
                </tr>
                {auctionContents.map((item, index) => {
                  return (
                    <tr key={index} className={styles.contentRow}>
                      <td>{item.id}</td>
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
