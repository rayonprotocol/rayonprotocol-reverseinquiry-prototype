import React, { Component, Fragment } from 'react';

// util
import history from 'common/util/Histroy';

// view
import Container from 'common/view/container/Container';
import RayonBlueButton from 'common/view/button/RayonBlueButton';
import TopBanner from 'common/view/banner/TopBanner';
import FocusAniInput from 'common/view/input/FocusAniInput';
import TagCheckBox from 'common/view/input/TagCheckBox';

// styles
import styles from './AuctionRegisterVC.scss';
import AuctionDC from 'auction/dc/AuctionDC';
import ContractDC from 'common/dc/ContractDC';

interface AuctionRegisterVCState {
  title: string;
  content: string;
  isError: boolean;
  selectedTagList: string[];
}

class AuctionRegisterVC extends Component<{}, AuctionRegisterVCState> {
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
    registerResult ? history.goBack() : alert('Submission failed, Might be due to server error so either re-submit or re-login');
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
      <Fragment>
        <TopBanner title={'Loan Requests'} description={''} />
        <Container className={styles.contentContainer}>
          <div className={styles.note}>
            <div>Notice</div>
            <p>1. Wallet Address and User ID are automatically filled in</p>
            <p>2. Revisions cannot be made once published so user attention is advised</p>
          </div>
          <FocusAniInput title={'Title'} onChangeInput={this.onChangeTitle.bind(this)} />
          <FocusAniInput title={'Content'} isTextArea={true} onChangeInput={this.onChangeContent.bind(this)} />
          <TagCheckBox
            className={styles.FinanceTag}
            title={'personal data to be provided'}
            dataList={myFinanceData}
            onChangeCheckBox={this.onChangeTag.bind(this)}
            name={'financeTag'}
            selectedList={selectedTagList}
          />
          <div className={styles.buttonWrap}>
            <RayonBlueButton onClick={this.onClickRegisterButton.bind(this)} title={'Submit'} />
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default AuctionRegisterVC;
