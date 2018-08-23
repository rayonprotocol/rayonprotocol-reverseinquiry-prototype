import React, { Component } from 'react';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// view
import TextInput from 'common/view/input/TextInput';
import ModalTitle from 'common/view/modal/ModalTitle';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';
import TagCheckboxGroup from 'common/view/input/TagCheckboxGroup';

// styles
import styles from './ReverseInquiryRegisterModalView.scss';

interface ReverseInquiryRegisterModalViewProps {
  isModalOpen: boolean;
  onRequestModalClose: () => void;
}

interface ReverseInquiryRegisterModalViewState {
  title: string;
  content: string;
  selFinanceItems: string[];
}

class ReverseInquiryRegisterModalView extends Component<
  ReverseInquiryRegisterModalViewProps,
  ReverseInquiryRegisterModalViewState
> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      selFinanceItems: [],
    };
  }

  async onClickRegisterButton() {
    if (this.state.selFinanceItems.length === 0) {
      alert('Personal data must be provided with loan request');
      return;
    }
    try {
      ReverseInquiryDC.registerReverseInquiry(this.state.title, this.state.content, this.state.selFinanceItems);
      this.props.onRequestModalClose();
    } catch {
      console.log('ReverseInquiry register failed');
    }
  }

  onChangeTitle(event) {
    const title = event.target.value;
    this.setState({ ...this.state, title });
  }

  onChangeContent(event) {
    const content = event.target.value;
    this.setState({ ...this.state, content });
  }

  onChangeTag(event) {
    // map 이용
    const valueIndex: number = this.state.selFinanceItems.indexOf(event.target.value);
    valueIndex === -1
      ? this.state.selFinanceItems.push(event.target.value)
      : this.state.selFinanceItems.splice(valueIndex, 1);
    this.setState({ ...this.state, selFinanceItems: this.state.selFinanceItems });
  }

  render() {
    const { selFinanceItems } = this.state;
    const userFinaceData = UserDC.getUserFinaceData();
    return (
      <RayonModalView isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onRequestModalClose}>
        <div>
          <div className={styles.note}>
            <ModalTitle
              className={styles.noticeTitle}
              title={'New Request'}
              onCloseRequest={this.props.onRequestModalClose}
            />
            <p>Notice</p>
            <p>1. Wallet Address and User ID are automatically filled in</p>
            <p>2. Revisions cannot be made once published so user attention is advised</p>
          </div>
          <TextInput title={'Title'} onChangeInputValue={this.onChangeTitle.bind(this)} />
          <TextInput title={'Content'} onChangeInputValue={this.onChangeContent.bind(this)} />
          {userFinaceData && (
            <TagCheckboxGroup
              className={styles.FinanceTag}
              name={'financeTag'}
              title={'personal data to be provided'}
              financeItems={Object.keys(userFinaceData)}
              selFinanceItems={selFinanceItems}
              onSelChanged={this.onChangeTag.bind(this)}
              isBorrower={true}
            />
          )}
          <RayonButton
            title={'Submit'}
            className={styles.buttonWrap}
            onClickButton={this.onClickRegisterButton.bind(this)}
          />
        </div>
      </RayonModalView>
    );
  }
}

export default ReverseInquiryRegisterModalView;
