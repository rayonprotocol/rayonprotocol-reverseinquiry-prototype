import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import User from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogRegisterReverseInquiryArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';

// util
import ArrayUtil from 'common/util/ArrayUtil';
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';
import ReverseInquiryRegisterModalView from 'reverseinquiry/view/ReverseInquiryRegisterModalView';

import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './ReverseInquiryBoardVC.scss';

interface ReverseInquiryBoardVCState {
  user: User;
  reverseInquiries: ReverseInquiry[];
  isRegisterModalOpen: boolean;
}

class ReverseInquiryBoardVC extends Component<{}, ReverseInquiryBoardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
      reverseInquiries: new Array<ReverseInquiry>(),
      isRegisterModalOpen: false,
    };
    this.LogRegisterReverseInquiry = this.LogRegisterReverseInquiry.bind(this);
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
  }

  componentWillMount(): void {
    ReverseInquiryDC.addEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount(): void {
    ReverseInquiryDC.removeEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]): void {
    this.setState({ ...this.state, reverseInquiries });
  }

  LogRegisterReverseInquiry(event: RayonEventResponse<LogRegisterReverseInquiryArgs>): void {
    const registeredReverseInquiry: ReverseInquiry = {
      id: event.args.id.toNumber(),
      title: event.args.title,
      description: event.args.description,
      financeData: event.args.financeData.split('%%'),
      userName: event.args.userName,
      userAddress: event.args.userAddress,
      insertTime: event.args.insertTime,
    };
    // add to array head because of order by insert time
    this.state.reverseInquiries.unshift(registeredReverseInquiry);
    this.setState({ ...this.state, reverseInquiries: this.state.reverseInquiries });
  }

  onRequestModalOpenStateToggle(): void {
    this.setState({ ...this.state, isRegisterModalOpen: !this.state.isRegisterModalOpen });
  }

  renderNoRequestToDate() {
    return (
      <div className={classNames(styles.emptyNote, { [styles.berryColor]: this.state.user.isBorrower })}>
        No Requests To Date
      </div>
    );
  }

  renderReverseInquiryTable() {
    return (
      <div className={styles.reverseInquiryTable}>
        {this.state.reverseInquiries.map((reverseInquiry, index) => {
          return (
            <div className={styles.contentRow} key={index}>
              <p className={styles.contentNumber}>{reverseInquiry.id + 1}</p>
              <p className={styles.contentTitle}>
                <Link to={`/reverseinquiry/content?id=${reverseInquiry.id}`}>{reverseInquiry.title}</Link>
              </p>
              <div className={styles.timeColumn}>{TimeConverter(reverseInquiry.insertTime)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Loan Request</p>
            <div className={styles.buttonWrap}>
              <RayonButton
                className={styles.registerBtn}
                title={'New Request'}
                isHidden={!this.state.user.isBorrower}
                onClickButton={this.onRequestModalOpenStateToggle.bind(this)}
                buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
              />
            </div>
          </div>
          {ArrayUtil.isEmpty(this.state.reverseInquiries)
            ? this.renderNoRequestToDate()
            : this.renderReverseInquiryTable()}
        </Container>
        <ReverseInquiryRegisterModalView
          isModalOpen={this.state.isRegisterModalOpen}
          onRequestModalClose={this.onRequestModalOpenStateToggle.bind(this)}
        />
      </Fragment>
    );
  }
}

export default ReverseInquiryBoardVC;
