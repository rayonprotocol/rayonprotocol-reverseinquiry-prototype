import React, { Component, Fragment } from 'react';

// util
import history from 'common/util/Histroy';

// view
import Container from 'common/view/container/Container';
import RayonBlueButton from 'common/view/button/RayonBlueButton';
import TopBanner from 'common/view/banner/TopBanner';
import FocusAniInput from 'common/view/input/FocusAniInput';
import TagCheckBox from 'common/view/input/TagCheckBox';

import CommonTextInput from 'common/view/input/CommonTextInput';
import CommonRayonButton from 'common/view/button/CommonRayonButton';
import ModalTitle from 'common/view/modal/ModalTitle';

// styles
import styles from './AuctionRegisterVC.scss';
import AuctionDC from 'auction/dc/AuctionDC';
import ContractDC from 'common/dc/ContractDC';

interface AuctionRegisterVCProps {
  onClickModal: () => void;
}

interface AuctionRegisterVCState {
  title: string;
  content: string;
  isError: boolean;
  selectedTagList: string[];
}

class AuctionRegisterVC extends Component<AuctionRegisterVCProps, AuctionRegisterVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isError: false,
      selectedTagList: [],
    };
  }

  async onClickRegisterButton() {
    const { title, content, selectedTagList } = this.state;
    if (selectedTagList.length === 0) return alert('Personal data must be provided with loan request');
    const registerResult = await AuctionDC.registerContent(title, content, selectedTagList);
    registerResult
      ? this.props.onClickModal()
      : alert('Submission failed, Might be due to server error so either re-submit or re-login');
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
    const value = event.target.value;
    const { selectedTagList } = this.state;
    const valueIndex = selectedTagList.indexOf(value);
    valueIndex === -1 ? selectedTagList.push(value) : selectedTagList.splice(valueIndex, 1);
    this.setState({ ...this.state, selectedTagList });
  }

  render() {
    const { selectedTagList } = this.state;
    const myFinanceData = Object.keys(JSON.parse(localStorage.getItem(ContractDC.getAccount())));
    return (
      <div>
        <div className={styles.note}>
          <ModalTitle className={styles.noticeTitle} title={'New Request'} onCloseRequest={this.props.onClickModal} />
          <p>Notice</p>
          <p>1. Wallet Address and User ID are automatically filled in</p>
          <p>2. Revisions cannot be made once published so user attention is advised</p>
        </div>
        <CommonTextInput title={'Title'} onChangeInputValue={this.onChangeTitle.bind(this)} />
        <CommonTextInput title={'Content'} onChangeInputValue={this.onChangeContent.bind(this)} />
        <TagCheckBox
          className={styles.FinanceTag}
          title={'personal data to be provided'}
          dataList={myFinanceData}
          onChangeCheckBox={this.onChangeTag.bind(this)}
          name={'financeTag'}
          selectedList={selectedTagList}
          isBorrower={true}
        />
        <CommonRayonButton
          title={'Submit'}
          className={styles.buttonWrap}
          isBorrower={true}
          onClickButton={this.onClickRegisterButton.bind(this)}
        />
      </div>
    );
  }
}

export default AuctionRegisterVC;
