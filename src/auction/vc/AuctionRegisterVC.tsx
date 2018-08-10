import React, { Component } from 'react';

// dc
import AuctionDC from 'auction/dc/AuctionDC';
import UserDC from 'user/dc/UserDC';

// view
import TextInput from 'common/view/input/TextInput';
import ModalTitle from 'common/view/modal/ModalTitle';
import TagCheckBox from 'common/view/input/TagCheckBox';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './AuctionRegisterVC.scss';

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
    try {
      AuctionDC.registerAuctionContent(title, content, selectedTagList);
      this.props.onClickModal();
    } catch {
      console.log('auction contenst register failed');
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
    const value = event.target.value;
    const { selectedTagList } = this.state;
    const valueIndex = selectedTagList.indexOf(value);
    valueIndex === -1 ? selectedTagList.push(value) : selectedTagList.splice(valueIndex, 1);
    this.setState({ ...this.state, selectedTagList });
  }

  render() {
    const { selectedTagList } = this.state;
    const localData = localStorage.getItem(UserDC.getUser().userAddress);
    let myFinanceData = localData !== undefined ? Object.keys(JSON.parse(localData)) : null;
    return (
      <div>
        <div className={styles.note}>
          <ModalTitle className={styles.noticeTitle} title={'New Request'} onCloseRequest={this.props.onClickModal} />
          <p>Notice</p>
          <p>1. Wallet Address and User ID are automatically filled in</p>
          <p>2. Revisions cannot be made once published so user attention is advised</p>
        </div>
        <TextInput title={'Title'} onChangeInputValue={this.onChangeTitle.bind(this)} />
        <TextInput title={'Content'} onChangeInputValue={this.onChangeContent.bind(this)} />
        {myFinanceData && (
          <TagCheckBox
            className={styles.FinanceTag}
            title={'personal data to be provided'}
            dataList={myFinanceData}
            onChangeCheckBox={this.onChangeTag.bind(this)}
            name={'financeTag'}
            selectedList={selectedTagList}
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

export default AuctionRegisterVC;
