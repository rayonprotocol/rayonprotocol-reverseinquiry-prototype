import React, { Component, Fragment } from 'react';

// model
import User from 'user/model/User';
import { MsgTypes } from 'message/model/Message';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';

// dc
import UserDC from 'user/dc/UserDC';
import MessageDC from 'message/dc/MessageDC';
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';

// util
import history from 'common/util/Histroy';
import UrlProcessor from 'common/util/UrlProcessor';

// view
import Container from 'common/view/container/Container';
import KeyValueText from 'common/view/text/KeyValueText';
import RayonButton from 'common/view/button/RayonButton';
import TagCheckboxGroup from 'common/view/input/TagCheckboxGroup';

// styles
import styles from './ReverseInquiryContentVC.scss';

interface ReverseInquiryVCState {
  user: User;
  contentId: number;
  reverseInquiry: ReverseInquiry;
  selTags: Set<string>;
}

class ReverseInquiryVC extends Component<{}, ReverseInquiryVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
      contentId: UrlProcessor.readNumberFromPath(props.location.search, UrlProcessor.KEY_ID),
      selTags: new Set<string>(),
    };
  }

  async componentWillMount(): Promise<void> {
    const reverseInquiry = await ReverseInquiryDC.fetchReverseInquiry(this.state.contentId);
    this.setState({ ...this.state, reverseInquiry });
  }

  onClickSendRequestButton(toAddress: string, reverseInquiryId: number): void {
    const payload = this.serlalizeSelectedTagSet();
    try {
      MessageDC.sendMessage(toAddress, 0, reverseInquiryId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
    } catch {
      console.error('send message failed');
    }
    history.goBack();
  }

  serlalizeSelectedTagSet() {
    return Array.from(this.state.selTags).join('%%');
  }

  onTagChecked(tag: string): void {
    if (UserDC.getUser().isBorrower) return;
    this.state.selTags.has(tag) ? this.state.selTags.delete(tag) : this.state.selTags.add(tag);
    this.setState({ ...this.state, selTags: this.state.selTags });
  }

  render() {
    const { reverseInquiry } = this.state;
    return (
      <Fragment>
        {reverseInquiry !== undefined && (
          <Container className={styles.contentContainer}>
            <div className={styles.goBackTitle} onClick={() => history.goBack()}>
              {'<   ' + reverseInquiry.title}
            </div>
            <KeyValueText className={styles.contentValue} title={'User ID'} value={reverseInquiry.userName} />
            <KeyValueText className={styles.contentValue} title={'Title'} value={reverseInquiry.title} />
            <KeyValueText className={styles.contentValue} title={'Content'} value={reverseInquiry.description} />
            <TagCheckboxGroup
              title={'Available Personal Data'}
              tags={reverseInquiry.financeData}
              selTags={this.state.selTags}
              onTagChecked={this.onTagChecked.bind(this)}
              tagColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
            <RayonButton
              className={styles.requestBtn}
              onClickButton={() => this.onClickSendRequestButton(reverseInquiry.userAddress, reverseInquiry.id)}
              isHidden={this.state.user.isBorrower}
              buttonColor={RAYON_BERRY}
              title={'Request Personal Data'}
            />
          </Container>
        )}
      </Fragment>
    );
  }
}

export default ReverseInquiryVC;
