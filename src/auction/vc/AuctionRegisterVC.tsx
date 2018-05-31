import React, { Component, Fragment } from 'react';

// model

// util
import history from 'common/util/Histroy';

// view
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';
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
    const registerResult = await AuctionDC.registerContent(title, content, selectedTagList);
    registerResult ? history.goBack() : alert('등록실패, 서버 오류이거나 로그인을 확인해 주세요');
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
        <TopBanner title={'공고 등록'} description={'역경매 공고를 동록하는 페이지입니다'} />
        <Container className={styles.contentContainer}>
          <div className={styles.note}>
            <div>주의사항</div>
            <p>1. 계좌번호와 유저이름은 자동으로 등록됩니다</p>
            <p>2. 한번 등록된 공고는 수정이 불가능 하므로 신중하게 작성해주세요</p>
          </div>
          <FocusAniInput title={'제목'} onChangeInput={this.onChangeTitle.bind(this)} />
          <FocusAniInput title={'내용'} isTextArea={true} onChangeInput={this.onChangeContent.bind(this)} />
          <TagCheckBox
            className={styles.FinanceTag}
            title={'제공 가능한 금융 데이터'}
            dataList={myFinanceData}
            onChangeCheckBox={this.onChangeTag.bind(this)}
            name={'financeTag'}
            selectedList={selectedTagList}
          />
          <div className={styles.buttonWrap}>
            <MarchBlueButton onClick={this.onClickRegisterButton.bind(this)} title={'등록'} />
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default AuctionRegisterVC;
