import React, { Component, Fragment } from 'react';

// model
import Message, { MsgTypes } from 'message/model/Message';

// dc
import ContractDC from 'common/dc/ContractDC';
import MessageDC from '../dc/MessageDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/Container';
import TopBanner from 'common/view/banner/TopBanner';

// styles
import styles from './MessageContentVC.scss';

interface MessageContentVCProps {
  match: any;
}

interface MessageContentVCState {
  messages: Message[];
  contentIndex: number;
}

class MessageContentVC extends Component<MessageContentVCProps, MessageContentVCState> {
  state = {
    ...this.state,
    messages: [],
  };

  async componentWillMount() {
    const {
      match: { params },
    } = this.props;
    const contentIndex = parseInt(params.id);
    const messages = await MessageDC.getUserMessages();
    this.setState({ ...this.state, messages, contentIndex }, () =>
      console.log('after set State', this.state.contentIndex)
    );
  }

  onClickDataSubmit(message: Message) {
    const data = localStorage.getItem(ContractDC.getAccount());
    if (data === null) return alert('금융데이터를 먼저 등록해주세요!');
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.RESPONSE_PERSONAL_DATA, data);
  }

  onClickProductOffer(message: Message) {
    const data = '제안사항: 이구아나 이구이구';
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.OFFER_PRODUCT, data);
  }

  onClickOfferAccept(message: Message) {
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.ACCEPT_OFFER, 'true');
  }

  onClickOfferDeny(message: Message) {
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.DENY_OFFER, 'false');
  }

  renderTag = (msgType: MsgTypes) => {
    const msgTypeNames = ['데이터 신청', '데이터 응답', '상품가입 요청', '상품가입 응답'];
    return <div className={styles.tag}>{msgTypeNames[msgType - 1]}</div>;
  };

  renderSpecialForm(message: Message) {
    const user = UserDC.getUser();
    console.log(user, 'user');
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          user.isPersonal && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickDataSubmit(message)}>
                데이터전송하기
              </div>
            </div>
          )
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
      case MsgTypes.DENY_OFFER:
        return (
          !user.isPersonal && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickProductOffer(message)}>
                상품제안전송하기
              </div>
            </div>
          )
        );
      case MsgTypes.OFFER_PRODUCT:
        return (
          user.isPersonal && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickOfferDeny(message)}>
                거절하기
              </div>
              <div className={styles.submitButton} onClick={() => this.onClickOfferAccept(message)}>
                수락하기
              </div>
            </div>
          )
        );
      case MsgTypes.ACCEPT_OFFER:
        return <div className={styles.bottomWrap}>신청이 완료되었습니다</div>;
      default:
        break;
    }
  }

  render() {
    const messages = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex);
    console.log('messagesmessagesmessages', messages);
    return (
      <Fragment>
        <TopBanner title={'메세지이력'} description={'역경매 공고글의 상세 메세지 이력'} />
        <Container className={styles.contentContainer}>
          {messages.length === 0 ? (
            <div>메세지가 없습니다</div>
          ) : (
            messages.map((item, index) => {
              return (
                <div key={index} className={styles.message}>
                  <div>{this.renderTag(item.msgType)}</div>
                  <div className={styles.fromAddress}>from : {item.fromAddress}</div>
                  <div className={styles.toAddress}>to : {item.toAddress}</div>
                  <div className={styles.payload}>payload :{item.payload}</div>
                  <div>{this.renderSpecialForm(item)}</div>
                </div>
              );
            })
          )}
        </Container>
      </Fragment>
    );
  }
}

export default MessageContentVC;
