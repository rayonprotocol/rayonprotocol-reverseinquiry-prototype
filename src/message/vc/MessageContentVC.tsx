import React, { Component, Fragment } from 'react';
import qs from 'query-string';

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
import MessageContentView from 'message/view/MessageContentView';
import MessageProductOfferModalView from 'message/view/MessageProductOfferModalView';

// util
import history from 'common/util/Histroy';

// styles
import styles from './MessageContentVC.scss';

interface MessageContentVCState {
  reverseInquiry: ReverseInquiry;
  messages: Message[];
  productOfferInput: string[];
  isProductOfferModalOpen: boolean;
  isLoading: boolean;
  user: User;
}

class MessageContentVC extends Component<{}, MessageContentVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isLoading: true,
      user: UserDC.getUser(),
      productOfferInput: new Array<string>(3),
    };
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
    this.onMessagesFetched = this.onMessagesFetched.bind(this);
    this.onMessageSent = this.onMessageSent.bind(this);
  }

  async componentWillMount() {
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    MessageDC.addMessagesListeners(this.onMessagesFetched);
    MessageDC.addEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
    MessageDC.removeMessagesListeners(this.onMessagesFetched);
    MessageDC.removeEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent);
  }

  onReverseInquiriesFetched(_reverseInquiries: ReverseInquiry[]) {
    const parsedReverseInquiryIndex = parseInt(qs.parse(this.props['location']['search']).id, 10);
    const reverseInquiry = _reverseInquiries.find(content => content.id === parsedReverseInquiryIndex);
    MessageDC.fetchMessages(_reverseInquiries);
    this.setState({ ...this.state, reverseInquiry });
  }

  onMessagesFetched(_messages: Map<number, Message[]>) {
    const parsedReverseInquiryIndex = parseInt(qs.parse(this.props['location']['search']).id, 10);
    this.setState({
      ...this.state,
      messages: _messages[parsedReverseInquiryIndex],
      isLoading: false,
    });
  }

  onMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>) {
    ReverseInquiryDC.fetchReverseInquiries();
  }

  onClickProductRejectOrAccept(message: Message, msgType: MsgTypes) {
    MessageDC.sendMessage(message.fromAddress, message.messageId, message.reverseInquiryId, msgType);
  }

  onRequestModalOpenStateToggle() {
    // break out when click open button, modal background, close button
    this.setState({ ...this.state, isProductOfferModalOpen: !this.state.isProductOfferModalOpen });
  }

  onResponseFinanceData(message: Message) {
    const userFinanceData = UserDC.getUserFinanceData();
    const requestFinanceDataKey = message.payload.split('%%');
    const responeseFinanceData = {};

    requestFinanceDataKey.forEach(item => {
      responeseFinanceData[item] = userFinanceData[item];
    });

    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.RESPONSE_PERSONAL_DATA,
      JSON.stringify(responeseFinanceData)
    );
  }

  onClickProductOfferSubmit() {
    const data = this.state.productOfferInput.join('##');
    const message = this.state.messages[0];
    MessageDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.OFFER_PRODUCT,
      data
    );
    this.setState({ ...this.state, isProductOfferModalOpen: false });
  }

  onChangeOfferedProductInput(event, index) {
    this.state.productOfferInput[index] = event.target.value;
    this.setState({ ...this.state, productOfferInput: this.state.productOfferInput });
  }

  render() {
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.goBackTitle} onClick={() => history.goBack()}>
            {'<   ' + this.state.reverseInquiry.title}
          </div>
          {this.state.isLoading ? (
            <div>Loading...</div>
          ) : (
            <MessageContentView
              user={this.state.user}
              messages={this.state.messages}
              onRequestModalOpenStateToggle={this.onRequestModalOpenStateToggle.bind(this)}
              onResponseFinanceData={this.onResponseFinanceData.bind(this)}
              onClickProductRejectOrAccept={this.onClickProductRejectOrAccept.bind(this)}
            />
          )}
        </Container>
        <MessageProductOfferModalView
          isModalOpen={this.state.isProductOfferModalOpen}
          onChangeProductOfferInput={this.onChangeOfferedProductInput.bind(this)}
          onClickProductOfferSubmit={this.onClickProductOfferSubmit.bind(this)}
          onRequestModalClose={this.onRequestModalOpenStateToggle.bind(this)}
        />
      </Fragment>
    );
  }
}

export default MessageContentVC;
