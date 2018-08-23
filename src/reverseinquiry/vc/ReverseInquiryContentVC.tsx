import React, { Component, Fragment } from 'react';
import qs from 'query-string';

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

// view
import Container from 'common/view/container/Container';
import KeyValueText from 'common/view/text/KeyValueText';
import RayonButton from 'common/view/button/RayonButton';
import TagCheckboxGroup from 'common/view/input/TagCheckboxGroup';

// styles
import styles from './ReverseInquiryContentVC.scss';

interface ReverseInquiryVCProps {
  match: any;
}

interface ReverseInquiryVCState {
  user: User;
  reverseInquiry: ReverseInquiry;
  selTags: Set<string>;
}

class ReverseInquiryVC extends Component<ReverseInquiryVCProps, ReverseInquiryVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
      selTags: new Set<string>(),
    };
  }

  async componentWillMount() {
    const parsedReverseInquiryIndex = parseInt(qs.parse(this.props['location']['search']).id, 10);
    const reverseInquiry = await ReverseInquiryDC.fetchReverseInquiry(parsedReverseInquiryIndex);
    this.setState({ ...this.state, reverseInquiry });
  }

  async onClickSendRequestButton(toAddress: string, reverseInquiryId: number) {
    const payload = Array.from(this.state.selTags).join('%%');
    MessageDC.sendMessage(toAddress, 0, reverseInquiryId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
    history.goBack();
  }

  onTagChecked(tag: string) {
    if (UserDC.getUser().isBorrower) return;
    if (this.state.selTags.has(tag)) this.state.selTags.delete(tag);
    else this.state.selTags.add(tag);
    this.setState({ ...this.state, selTags: this.state.selTags });
  }

  onClickTitle() {
    history.goBack();
  }

  render() {
    const { reverseInquiry } = this.state;
    return (
      <Fragment>
        {reverseInquiry !== undefined && (
          <Container className={styles.contentContainer}>
            <div className={styles.goBackTitle} onClick={this.onClickTitle}>
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
