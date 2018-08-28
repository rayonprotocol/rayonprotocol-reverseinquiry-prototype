import React, { Component, Fragment } from 'react';

// model
import User from 'user/model/User';
import Message, { MsgTypes } from 'reverseinquiry/model/Message';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogSendReverseInquiryMessageArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';

// view
import Container from 'common/view/container/Container';
import MessageContentView from 'reverseinquiry/view/MessageContentView';
import MessageProductOfferModalView from 'reverseinquiry/view/MessageProductOfferModalView';

// util
import history from 'common/util/Histroy';
import UrlProcessor from 'common/util/UrlProcessor';

// styles
import styles from './MessageContentVC.scss';

interface MessageContentVCState {
  isLoading: boolean;
  productOfferInput: string[];
  reverseInquiry: ReverseInquiry;
  isProductOfferModalOpen: boolean;
  user: User;
}

class MessageContentVC extends Component<{}, MessageContentVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isLoading: true,
      productOfferInput: new Array<string>(3),
      user: UserDC.getUser(),
    };
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
    this.onMessageSent = this.onMessageSent.bind(this);
  }

  componentWillMount() {
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.addEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.removeEventListener(RayonEvent.LogSendReverseInquiryMessage, this.onMessageSent);
  }

  onReverseInquiriesFetched(_reverseInquiries: ReverseInquiry[]) {
    const contentId = UrlProcessor.readNumberFromPath(this.props['location']['search'], UrlProcessor.KEY_ID);
    const targetReverseInquiry = _reverseInquiries.find(reverseInquiry => reverseInquiry.id === contentId);
    this.setState({ ...this.state, reverseInquiry: targetReverseInquiry, isLoading: false });
  }

  onMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>) {
    ReverseInquiryDC.fetchReverseInquiries();
  }

  onClickProductRejectOrAccept(message: Message, msgType: MsgTypes) {
    ReverseInquiryDC.sendMessage(message.fromAddress, message.messageId, message.reverseInquiryId, msgType);
  }

  onRequestModalOpenStateToggle() {
    this.setState({ ...this.state, isProductOfferModalOpen: !this.state.isProductOfferModalOpen });
  }

  onResponseFinanceData(message: Message) {
    const userFinanceData = UserDC.getUserFinanceData();
    const requestFinanceDataKey = message.content.split('%%');
    const responeseFinanceData = {};

    requestFinanceDataKey.forEach(item => {
      responeseFinanceData[item] = userFinanceData[item];
    });

    ReverseInquiryDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.RESPONSE_PERSONAL_DATA,
      JSON.stringify(responeseFinanceData)
    );
  }

  onClickProductOfferSubmit() {
    const data = this.state.productOfferInput.join('##');
    const message = this.state.reverseInquiry.messages[0];
    ReverseInquiryDC.sendMessage(
      message.fromAddress,
      message.messageId,
      message.reverseInquiryId,
      MsgTypes.OFFER_PRODUCT,
      data
    );
    this.setState({ ...this.state, isProductOfferModalOpen: false });
  }

  onChangeOfferedProductInput(value: string, index: number) {
    this.state.productOfferInput[index] = value;
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
              messages={this.state.reverseInquiry.messages}
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
