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
    await MessageDC.insertMessage(toAddress, auctionId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
    history.goBack();
  }

  onChangeCheckBox(event) {
    if (UserDC.getUser().isPersonal) return;
    const value = event.target.value;
    const { selectedTagList } = this.state;
    const valueIndex = selectedTagList.indexOf(value);
    valueIndex === -1 ? selectedTagList.push(value) : selectedTagList.splice(valueIndex, 1);
    this.setState({ ...this.state, selectedTagList });
  }

  render() {
    const { content, selectedTagList } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <TopBanner title={'공고 상세'} description={'역경매 내역을 상세하게 볼 수 있습니다'} />
        {content !== undefined && (
          <Container className={styles.contentContainer}>
            <div className={styles.block}>
              <div className={styles.inlineValue}>
                <div className={styles.subtitle}>작성자</div>
                <div className={styles.value}>{content.userName}</div>
              </div>
              <div className={styles.inlineValue}>
                <div className={styles.subtitle}>작성일</div>
                <div className={styles.value}>{TimeConverter(content.timeStamp)}</div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.subtitle}>제목</div>
              <div className={styles.value}>{content.title}</div>
            </div>
            <div className={styles.block}>
              <div className={styles.subtitle}>내용</div>
              <div className={styles.bloackValue}>{content.content}</div>
            </div>
            <div className={styles.block}>
              <TagCheckBox
                title={'제공 가능한 데이터'}
                dataList={content.financeData}
                selectedList={selectedTagList}
                name={'financeData'}
                onChangeCheckBox={this.onChangeCheckBox.bind(this)}
              />
            </div>

            {!user.isPersonal && (
              <div
                className={styles.submitButton}
                onClick={() => this.onClickRequestButton(content.userAddress, content.id)}
              >
                데이터 요청
              </div>
            )}
          </Container>
        )}
      </Fragment>
    );
  }
}

export default AuctionContentVC;
