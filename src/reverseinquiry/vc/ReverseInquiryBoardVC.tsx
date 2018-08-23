import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// model
import User from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogRegisterReverseInquiryArgs } from 'common/model/RayonEvent';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// util
import TimeConverter from 'common/util/TimeConverter';
import ArrayUtil from 'common/util/ArrayUtil';

// view
import Container from 'common/view/container/Container';
import ReverseInquiryRegisterModalView from 'reverseinquiry/view/ReverseInquiryRegisterModalView';

import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './ReverseInquiryBoardVC.scss';

interface ReverseInquiryBoardVCState {
  reverseInquiries: ReverseInquiry[];
  isRegisterModalOpen: boolean;
}

class ReverseInquiryBoardVC extends Component<{}, ReverseInquiryBoardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      reverseInquiries: new Array<ReverseInquiry>(),
      isRegisterModalOpen: false,
    };
    this.LogRegisterReverseInquiry = this.LogRegisterReverseInquiry.bind(this);
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
  }

  async componentWillMount() {
    ReverseInquiryDC.addEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]) {
    this.setState({ ...this.state, reverseInquiries });
  }

  LogRegisterReverseInquiry(event: RayonEventResponse<LogRegisterReverseInquiryArgs>) {
    const registeredReverseInquiry: ReverseInquiry = {
      id: event.args.id.toNumber(),
      title: event.args.title,
      description: event.args.description,
      financeData: event.args.financeData.split('%%'),
      userName: event.args.userName,
      userAddress: event.args.userAddress,
      insertTime: event.args.insertTime,
    };
    this.state.reverseInquiries.unshift(registeredReverseInquiry); // add to array head because of order by insert time
    this.setState({ ...this.state, reverseInquiries: this.state.reverseInquiries });
  }

  onRequestModalOpenStateToggle() {
    // break out when click open button, modal background, close button
    this.setState({ ...this.state, isRegisterModalOpen: !this.state.isRegisterModalOpen });
  }

  renderNoRequestToDate(user: User) {
    return (
      <div className={classNames(styles.emptyNote)} style={{ color: user.isBorrower ? RAYON_LAKE : RAYON_BERRY }}>
        No Requests To Date
      </div>
    );
  }

  render() {
    const { reverseInquiries } = this.state;
    const user: User = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Loan Request</p>
            <div className={styles.buttonWrap}>
              <RayonButton
                className={styles.registerBtn}
                title={'New Request'}
                isHidden={!user.isBorrower}
                onClickButton={this.onRequestModalOpenStateToggle.bind(this)}
              />
            </div>
          </div>
          {ArrayUtil.isEmpty(reverseInquiries) ? (
            this.renderNoRequestToDate(user)
          ) : (
            <div className={styles.reverseInquiryTable}>
              {reverseInquiries.map((reverseInquiry, index) => {
                return (
                  <div className={styles.contentRow} key={index}>
                    <p className={styles.contentNumber}>{reverseInquiry.id + 1}</p>
                    <p className={styles.contentsTitle}>
                      <Link to={`/reverseinquiry/content?id=${reverseInquiry.id}`}>{reverseInquiry.title}</Link>
                    </p>
                    <div className={styles.timeColumn}>{TimeConverter(reverseInquiry.insertTime)}</div>
                  </div>
                );
              })}
            </div>
          )}
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
