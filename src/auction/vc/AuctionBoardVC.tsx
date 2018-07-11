import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Modal from 'react-modal';

// dc
import AuctionDC from '../dc/AuctionDC';
import UserDC from 'user/dc/UserDC';

// model
import Auction from 'auction/model/Auction';

// util
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';
import CommonRayonButton from 'common/view/button/CommonRayonButton';
import AuctionRegisterVC from 'auction/vc/AuctionRegisterVC';

// styles
import styles from './AuctionBoardVC.scss';

interface AuctionBoardVCState {
  auctionContents: Auction[];
  isSignUpModalOpen: boolean;
}

class AuctionBoardVC extends Component<{}, AuctionBoardVCState> {
  state = {
    ...this.state,
    auctionContents: [],
  };

  onClickRegisterButton() {
    this.setState({ ...this.state, isSignUpModalOpen: true });
  }

  async componentWillMount() {
    const auctionContents = await AuctionDC.getContentList();
    this.setState({ ...this.state, auctionContents });
  }

  onClickModal(isClose?: boolean) {
    this.setState({ ...this.state, isSignUpModalOpen: !this.state.isSignUpModalOpen });
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isSignUpModalOpen: false });
  }

  render() {
    const { auctionContents } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Loan Request</p>
            {user.isBorrower && (
              <div className={styles.buttonWrap}>
                <CommonRayonButton
                  className={styles.registerBtn}
                  title={'New Request'}
                  isBorrower={true}
                  onClickButton={this.onClickRegisterButton.bind(this)}
                />
              </div>
            )}
          </div>
          {auctionContents.length === 0 ? (
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
              {auctionContents.sort((a, b) => b.id - a.id).map((item, index) => {
                return (
                  <div className={styles.contentRow} key={index}>
                    <p className={styles.contentNumber}>{item.id + 1}</p>
                    <p className={styles.contentsTitle}>
                      <Link to={`/auction/content/${item.id}`}>{item.title}</Link>
                    </p>
                    <div className={styles.timeColumn}>{TimeConverter(item.timeStamp)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
        <Modal
          ariaHideApp={false}
          className={styles.modal}
          isOpen={this.state.isSignUpModalOpen}
          onRequestClose={this.onRequestCloseModal.bind(this)}
          shouldCloseOnOverlayClick={true}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              width: '85%',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              borderRadius: '0px',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <AuctionRegisterVC onClickModal={this.onClickModal.bind(this)} />
        </Modal>
      </Fragment>
    );
  }
}

export default AuctionBoardVC;
