import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';

// model
import Message, { MsgTypes } from 'message/model/Message';
import User from 'user/model/User';

// dc
import ContractDC from 'common/dc/ContractDC';
import MessageDC from '../dc/MessageDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import TopBanner from 'common/view/banner/TopBanner';
import FocusAniInput from 'common/view/input/FocusAniInput';

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
    console.log('message.msgIndex',message.msgIndex)
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
    this.setState({...this.state, isModalOpen : false});
  }

  onClickOpenModal(){
    this.setState({...this.state, isModalOpen : true});
  }

  onClickOfferSubmit() {
    const data = this.state.productOfferInput.join('##');
    const message = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex)[0];
    console.log(data);
    MessageDC.insertMessage(message.fromAddress, message.auctionId, MsgTypes.OFFER_PRODUCT, message.msgIndex, data);
    this.setState({...this.state, isOpen : false});
  }

  onChangeProductOfferInput(event, index) {
    let { productOfferInput } = this.state;
    productOfferInput[index] = event.target.value;
    this.setState({ ...this.state, productOfferInput });
  }

  renderTag = (msgType: MsgTypes) => {
    const borrowerMsgTypeNames = [
      'Received Data Request',
      'Sent Data',
      'Offer Received',
      'Accepted Offer',
      'Rejected Offer',
    ];
    const lenderMsgTypeNames = ['Requested Data', 'Received Data', 'Loan Offered', 'Accepted Offer', 'Rejected Offer'];
    return (
      <div
        className={classNames(styles.tag, {
          [styles.orangeTag]: msgType === MsgTypes.RESPONSE_PERSONAL_DATA,
          [styles.pupleTag]: msgType === MsgTypes.OFFER_PRODUCT,
          [styles.lightgrayTag]: msgType === MsgTypes.DENY_OFFER,
          [styles.greenTag]: msgType === MsgTypes.ACCEPT_OFFER,
        })}
      >
        {this.state.user.isBorrower ? borrowerMsgTypeNames[msgType - 1] : lenderMsgTypeNames[msgType - 1]}
      </div>
    );
  };

  renderSpecialForm(message: Message) {
    const user = UserDC.getUser();
    switch (message.msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        return (
          user.isBorrower && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickDataSubmit(message)}>
                Send Data >
              </div>
            </div>
          )
        );
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        return (
          !user.isBorrower && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickOpenModal()}>
                Send Offer >
              </div>
            </div>
          )
        );
      case MsgTypes.OFFER_PRODUCT:
        return (
          user.isBorrower && (
            <div className={styles.bottomWrap}>
              <div className={styles.submitButton} onClick={() => this.onClickOfferDeny(message)}>
                Reject >
              </div>
              <div className={styles.submitButton} onClick={() => this.onClickOfferAccept(message)}>
                Accept >
              </div>
            </div>
          )
        );
      case MsgTypes.ACCEPT_OFFER:
        return <div className={styles.bottomWrap}>Application Completed</div>;
      default:
        break;
    }
  }

  renderPayload(msgType: MsgTypes, payload: string) {
    switch (msgType) {
      case MsgTypes.REQUEST_PERSONAL_DATA:
        const offeredData = payload.split('%%');
        return offeredData.map((item, index) => {
          return (
            <div className={styles.payloadTag} key={index}>
              {item}
            </div>
          );
        });
      case MsgTypes.RESPONSE_PERSONAL_DATA:
        const financeData = JSON.parse(payload);
        return Object.keys(financeData).map((item, index) => {
          return (
            <div className={styles.financeData} key={index}>
              {item} : {financeData[item]}
            </div>
          );
        });
      case MsgTypes.OFFER_PRODUCT:
      const offeredProductData = payload.split('##');
        const prefixStr = ['Amount', 'Interest', 'Maturity'];
          return offeredProductData.map((item, index) => {
            return (
              <div className={styles.financeData} key={index}>
                {prefixStr[index] + ':' + item}
              </div>
            );
        });
      case MsgTypes.ACCEPT_OFFER:
        return (<div className={styles.complete}>
          <div className={styles.note}>Thank you for choosing our offer. You can sign up for your product by clicking on the link below</div>
          <div className={styles.link}>product link: <a href="https://www.rayonprotocol.io/">https://www.rayonprotocol.io/</a></div>
        </div>);
      default:
        return;
    }
  }

  render() {
    const messages = MessageDC.getUserMessagesByAuctionId(this.state.contentIndex);
    return (
      <Fragment>
        <TopBanner title={'Mailbox'} description={''} />
        <Container className={styles.contentContainer}>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            messages.map((item, index) => {
              return (
                <div key={index} className={styles.message}>
                  <div className={styles.tagWrap}>
                    {this.renderTag(item.msgType)}
                    {!item.isComplete && this.renderSpecialForm(item)}
                  </div>
                  <div className={styles.dataWrap}>
                    <div className={styles.fromAddress}>
                      <div className={styles.fromto}>From</div>
                      <div className={styles.userID}>{item.fromUserID}</div>
                      <div className={styles.userAddress}>{item.fromAddress}</div>
                    </div>
                    <div className={styles.toAddress}>
                      <div className={styles.fromto}>To</div>
                      <div className={styles.userID}>{item.toUserID}</div>
                      <div className={styles.userAddress}>{item.toAddress}</div>
                    </div>
                    <div className={styles.payload}>{this.renderPayload(item.msgType, item.payload)}</div>
                  </div>
                </div>
              );
            })
          )}
        </Container>
        <Modal
              ariaHideApp={false}
              className={styles.modal}
              isOpen={this.state.isModalOpen}
              onRequestClose={this.onRequestCloseModal.bind(this)}
              shouldCloseOnOverlayClick={true}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <div>
                <div className={styles.title}>Product Offer</div>
                <div className={styles.formWarpper}>
                <FocusAniInput title={'Amount'} onChangeInput={(event) => this.onChangeProductOfferInput(event, 0)} />
                </div>
                <div className={styles.formWarpper}>
                <FocusAniInput title={'Interest'} onChangeInput={(event) => this.onChangeProductOfferInput(event, 1)} />
                </div>
                <div className={styles.formWarpper}>
                <FocusAniInput title={'Maturity'} onChangeInput={(event) => this.onChangeProductOfferInput(event, 2)} />
                </div>
                <div className={styles.button}>
                  <div onClick={this.onClickOfferSubmit.bind(this)}>Submit</div>
                </div>
              </div>
        </Modal>
      </Fragment>
    );
  }
}

export default MessageContentVC;
