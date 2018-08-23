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
  content: ReverseInquiry;
  selectedTagList: string[];
}

class ReverseInquiryVC extends Component<ReverseInquiryVCProps, ReverseInquiryVCState> {
  constructor(props) {
    super(props);
    const parsed = qs.parse(props.location.search);
    this.state = {
      ...this.state,
      content: undefined,
      selectedTagList: [],
      contentIndex: parseInt(parsed.id),
    };
  }

  async componentWillMount() {
    const content = await ReverseInquiryDC.fetchReverseInquiry(this.state.contentIndex);
    this.setState({ ...this.state, content });
  }

  async onClickRequestButton(toAddress: string, reverseInquiryId: number) {
    const payload = this.state.selectedTagList.join('%%');
    MessageDC.sendMessage(toAddress, 0, reverseInquiryId, MsgTypes.REQUEST_PERSONAL_DATA, payload);
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
            <KeyValueText className={styles.contentValue} title={'User ID'} value={content.userName} />
            <KeyValueText className={styles.contentValue} title={'Title'} value={content.title} />
            <KeyValueText className={styles.contentValue} title={'Content'} value={content.description} />
            <TagCheckboxGroup
              title={'Available Personal Data'}
              financeItems={content.financeData}
              selFinanceItems={selectedTagList}
              name={'financeData'}
              onSelChanged={this.onChangeCheckBox.bind(this)}
              isBorrower={user.isBorrower}
            />
            <RayonButton
              className={styles.requestBtn}
              onClickButton={() => this.onClickRequestButton(content.userAddress, content.id)}
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
