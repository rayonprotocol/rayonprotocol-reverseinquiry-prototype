import React, { Component } from 'react';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// view
import TextInput from 'common/view/input/TextInput';
import ModalTitle from 'common/view/modal/ModalTitle';
import TagCheckBox from 'common/view/input/TagCheckBox';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './ReverseInquiryRegisterVC.scss';

interface ReverseInquiryRegisterVCProps {
  onClickButtonClicked: () => void;
}

interface ReverseInquiryRegisterVCState {
  title: string;
  content: string;
  isError: boolean;
  selFinanceItems: string[];
}

class ReverseInquiryRegisterVC extends Component<ReverseInquiryRegisterVCProps, ReverseInquiryRegisterVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isError: false,
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
      this.props.onClickButtonClicked();
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
    //map 이용
    const valueIndex: number = this.state.selFinanceItems.indexOf(event.target.value);
    valueIndex === -1
      ? this.state.selFinanceItems.push(event.target.value)
      : this.state.selFinanceItems.splice(valueIndex, 1);
    this.setState({ ...this.state, selFinanceItems: this.state.selFinanceItems });
  }

  render() {
    const { selFinanceItems } = this.state;
    const localData = localStorage.getItem(UserDC.getUser().userAddress);
    let financeItems = localData !== undefined ? Object.keys(JSON.parse(localData)) : null;
    return (
      <div>
        <div className={styles.note}>
          <ModalTitle
            className={styles.noticeTitle}
            title={'New Request'}
            onCloseRequest={this.props.onClickButtonClicked}
          />
          <p>Notice</p>
          <p>1. Wallet Address and User ID are automatically filled in</p>
          <p>2. Revisions cannot be made once published so user attention is advised</p>
        </div>
        <TextInput title={'Title'} onChangeInputValue={this.onChangeTitle.bind(this)} />
        <TextInput title={'Content'} onChangeInputValue={this.onChangeContent.bind(this)} />
        {financeItems && (
          <TagCheckBox
            className={styles.FinanceTag}
            name={'financeTag'}
            title={'personal data to be provided'}
            financeItems={financeItems}
            selFinanceItems={selFinanceItems}
            onSelChanged={this.onChangeTag.bind(this)}
            isBorrower={true}
          />
        )}
        <RayonButton
          title={'Submit'}
          className={styles.buttonWrap}
          isBorrower={true}
          onClickButton={this.onClickRegisterButton.bind(this)}
        />
      </div>
    );
  }
}

export default ReverseInquiryRegisterVC;
