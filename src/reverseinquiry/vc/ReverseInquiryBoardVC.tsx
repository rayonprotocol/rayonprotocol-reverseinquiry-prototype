import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// model
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogRegisterReverseInquiryArgs } from 'common/model/RayonEvent';

// util
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';
import ReverseInquiryRegisterVC from 'reverseinquiry/vc/ReverseInquiryRegisterVC';
import RayonModalView from 'common/view/modal/RayonModalView';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './ReverseInquiryBoardVC.scss';

interface ReverseInquiryBoardVCState {
  reverseInquiries: ReverseInquiry[];
  isSignUpModalOpen: boolean;
}

class ReverseInquiryBoardVC extends Component<{}, ReverseInquiryBoardVCState> {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            reverseInquiries: [],
            isSignUpModalOpen: false,
        };
        this.OnLogRegisterAuctionContent = this.OnLogRegisterAuctionContent.bind(this);
        this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
    }

  async componentWillMount() {
    ReverseInquiryDC.addEventListener(RayonEvent.LogRegisterReverseInquiry, this.OnLogRegisterAuctionContent);
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeEventListener(RayonEvent.LogRegisterReverseInquiry, this.OnLogRegisterAuctionContent);
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]) {
    this.setState({ ...this.state, reverseInquiries });
  }

  // blockchain events
  OnLogRegisterAuctionContent(event: RayonEventResponse<LogRegisterReverseInquiryArgs>) {
    const newReverseInquiry: ReverseInquiry = {
      id: event.args.id.toNumber(),
      title: event.args.title,
      content: event.args.content,
      financeData: event.args.financeData.split('%%'),
      userName: event.args.userName,
      userAddress: event.args.userAddress,
      timeStamp: event.args.timeStamp,
    };
    this.state.reverseInquiries.unshift(newReverseInquiry);
    this.setState({ ...this.state, reverseInquiries: this.state.reverseInquiries });
  }

  /*
  component callback
  */
  onRegisterButtonClicked() {
    this.setState({ ...this.state, isSignUpModalOpen: true });
  }

  onModalButtonClicked() {
    this.setState({ ...this.state, isSignUpModalOpen: !this.state.isSignUpModalOpen });
  }

  onBackgroundClicked() {
    this.setState({ ...this.state, isSignUpModalOpen: false });
  }

  render() {
    const { reverseInquiries } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Loan Request</p>
            {user.isBorrower && (
              <div className={styles.buttonWrap}>
                <RayonButton
                  className={styles.registerBtn}
                  title={'New Request'}
                  isBorrower={true}
                  onClickButton={this.onModalButtonClicked.bind(this)}
                />
              </div>
            )}
          </div>
          {reverseInquiries.length === 0 ? (
            <div
              className={classNames(styles.emptyNote, {
                [styles.borrower]: user.isBorrower,
                [styles.lender]: !user.isBorrower,
              })}
            >
              No Requests To Date
            </div>
          ) : (
            <div className={styles.auctionTable}>
              {reverseInquiries.map((auctionContent, index) => {
                return (
                  <div className={styles.contentRow} key={index}>
                    <p className={styles.contentNumber}>{auctionContent.id + 1}</p>
                    <p className={styles.contentsTitle}>
                      <Link to={`/auction/content?id=${auctionContent.id}`}>{auctionContent.title}</Link>
                    </p>
                    <div className={styles.timeColumn}>{TimeConverter(auctionContent.timeStamp)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
        <RayonModalView isModalOpen={this.state.isSignUpModalOpen} onRequestClose={this.onBackgroundClicked.bind(this)}>
          <ReverseInquiryRegisterVC onClickButtonClicked={this.onModalButtonClicked.bind(this)} />
        </RayonModalView>
      </Fragment>
    );
  }
}

export default ReverseInquiryBoardVC;
