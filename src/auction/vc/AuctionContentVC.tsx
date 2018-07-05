import React, { Component, Fragment } from 'react';

// model
import Message, { MsgTypes } from 'message/model/Message';
import Auction from 'auction/model/Auction';

// dc
import AuctionDC from 'auction/dc/AuctionDC';
import MessageDC from 'message/dc/MessageDC';
import UserDC from 'user/dc/UserDC';

// util
import TimeConverter from 'common/util/TimeConverter';
import history from 'common/util/Histroy';

// view
import Container from 'common/view/Container';
import TopBanner from 'common/view/banner/TopBanner';
import TagCheckBox from 'common/view/input/TagCheckBox';

// styles
import styles from './AuctionContentVC.scss';

interface AuctionContentVCProps {
  match: any;
}

interface AuctionContentVCState {
  contentIndex: number;
  content: Auction;
  selectedTagList: string[];
}

class AuctionContentVC extends Component<AuctionContentVCProps, AuctionContentVCState> {
  state = {
    ...this.state,
    content: undefined,
    selectedTagList: [],
  };

  async componentWillMount() {
    const {
      match: { params },
    } = this.props;
    const contentIndex = params.id;
    await AuctionDC.getContentList();
    const content = AuctionDC.getAuctionContent(contentIndex);
    this.setState({ ...this.state, contentIndex, content });
  }

  async onClickRequestButton(toAddress: string, auctionId: number) {
    const payload = this.state.selectedTagList.join('%%');
    await MessageDC.insertStartMessage(toAddress, auctionId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
    history.goBack();
  }

  onChangeCheckBox(event) {
    if (UserDC.getUser().isBorrower) return;
    const value = event.target.value;
    const { selectedTagList } = this.state;
    const valueIndex = selectedTagList.indexOf(value);
    valueIndex === -1 ? selectedTagList.push(value) : selectedTagList.splice(valueIndex, 1);
    this.setState({ ...this.state, selectedTagList });
  }

  render() {
    const { content, selectedTagList } = this.state;
    const user = UserDC.getUser();
    console.log('content', content);
    return (
      <Fragment>
        <TopBanner title={'Loan Request Details'} description={''} />
        {content !== undefined && (
          <Container className={styles.contentContainer}>
            <div className={styles.block}>
              <div className={styles.inlineValue}>
                <div className={styles.subtitle}>User ID</div>
                <div className={styles.value}>{content.userName}</div>
              </div>
              <div className={styles.inlineValue}>
                <div className={styles.subtitle}>Date</div>
                <div className={styles.value}>{TimeConverter(content.timeStamp)}</div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.subtitle}>Title</div>
              <div className={styles.value}>{content.title}</div>
            </div>
            <div className={styles.block}>
              <div className={styles.subtitle}>Content</div>
              <div className={styles.bloackValue}>{content.content}</div>
            </div>
            <div className={styles.block}>
              <TagCheckBox
                title={'Available Personal Data'}
                dataList={content.financeData}
                selectedList={selectedTagList}
                name={'financeData'}
                onChangeCheckBox={this.onChangeCheckBox.bind(this)}
              />
            </div>

            {!user.isBorrower && (
              <div
                className={styles.submitButton}
                onClick={() => this.onClickRequestButton(content.userAddress, content.id)}
              >
                Request Personal Data
              </div>
            )}
          </Container>
        )}
      </Fragment>
    );
  }
}

export default AuctionContentVC;
