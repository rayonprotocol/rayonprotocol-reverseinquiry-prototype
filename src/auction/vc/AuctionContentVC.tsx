import React, { Component, Fragment } from 'react';

// model
import { MsgTypes } from 'message/model/Message';
import Auction from 'auction/model/Auction';

// dc
import AuctionDC from 'auction/dc/AuctionDC';
import MessageDC from 'message/dc/MessageDC';
import UserDC from 'user/dc/UserDC';

// util
import history from 'common/util/Histroy';

// view
import Container from 'common/view/container/Container';
import TagCheckBox from 'common/view/input/TagCheckBox';
import CommonKeyValueText from 'common/view/text/CommonKeyValueText';
import CommonRayonButton from 'common/view/button/CommonRayonButton';

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
    const content = AuctionDC.getAuctionContentByIndex(contentIndex);
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

  onClickTitle() {
    history.goBack();
  }

  render() {
    const { content, selectedTagList } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        {content !== undefined && (
          <Container className={styles.contentContainer}>
            <div className={styles.goBackTitle} onClick={this.onClickTitle}>
              {'<   ' + content.title}
            </div>
            <CommonKeyValueText className={styles.contentValue} title={'User ID'} value={content.userName} />
            <CommonKeyValueText className={styles.contentValue} title={'Title'} value={content.title} />
            <CommonKeyValueText className={styles.contentValue} title={'Content'} value={content.content} />
            <TagCheckBox
              title={'Available Personal Data'}
              dataList={content.financeData}
              selectedList={selectedTagList}
              name={'financeData'}
              onChangeCheckBox={this.onChangeCheckBox.bind(this)}
              isBorrower={user.isBorrower}
            />
            {!user.isBorrower && (
              <CommonRayonButton
                className={styles.requestBtn}
                onClickButton={() => this.onClickRequestButton(content.userAddress, content.id)}
                isBorrower={user.isBorrower}
                title={'Request Personal Data'}
              />
            )}
          </Container>
        )}
      </Fragment>
    );
  }
}

export default AuctionContentVC;
