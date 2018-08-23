import React, { Component, Fragment } from 'react';
import qs from 'query-string';

// model
import { RAYON_BERRY } from 'common/model/Style';
import { MsgTypes } from 'message/model/Message';
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
  contentIndex: number;
  reverseInquiry: ReverseInquiry;
  selectedTagList: string[];
}

class ReverseInquiryVC extends Component<ReverseInquiryVCProps, ReverseInquiryVCState> {
  constructor(props) {
    super(props);
    const parsed = qs.parse(props.location.search);
    this.state = {
      ...this.state,
      selectedTagList: new Array<string>(),
      contentIndex: parseInt(parsed.id, 10),
    };
  }

  async componentWillMount() {
    const reverseInquiry = await ReverseInquiryDC.fetchReverseInquiry(this.state.contentIndex);
    this.setState({ ...this.state, reverseInquiry });
  }

  async onClickSendRequestButton(toAddress: string, reverseInquiryId: number) {
    const payload = this.state.selectedTagList.join('%%');
    MessageDC.sendMessage(toAddress, 0, reverseInquiryId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
    history.goBack();
  }

  onChangeCheckBox(event) {
    if (UserDC.getUser().isBorrower) return;
    const value = event.target.value;
    const valueIndex = this.state.selectedTagList.indexOf(value);
    valueIndex === -1 ? this.state.selectedTagList.push(value) : this.state.selectedTagList.splice(valueIndex, 1);
    this.setState({ ...this.state, selectedTagList: this.state.selectedTagList });
  }

  onClickTitle() {
    history.goBack();
  }

  render() {
    const { reverseInquiry, selectedTagList } = this.state;
    const user = UserDC.getUser();
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
              financeItems={reverseInquiry.financeData}
              selFinanceItems={selectedTagList}
              name={'financeData'}
              onSelChanged={this.onChangeCheckBox.bind(this)}
              isBorrower={user.isBorrower}
            />
            <RayonButton
              className={styles.requestBtn}
              onClickButton={() => this.onClickSendRequestButton(reverseInquiry.userAddress, reverseInquiry.id)}
              isHidden={user.isBorrower}
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
