import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// dc
import AuctionDC from '../dc/AuctionDC';
import UserDC from 'user/dc/UserDC';

// model
import Auction from 'auction/model/Auction';

// util
import history from 'common/util/Histroy';
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';
import TopBanner from 'common/view/banner/TopBanner';

// styles
import styles from './AuctionBoardVC.scss';

interface AuctionBoardVCState {
  auctionContents: Auction[];
}

class AuctionBoardVC extends Component<{}, AuctionBoardVCState> {
  state = {
    ...this.state,
    auctionContents: [],
  };

  onClickRegisterButton() {
    history.push('/auction/register');
    console.log('글쓰기버튼 누름');
  }

  async componentWillMount() {
    const auctionContents = await AuctionDC.getContentList();
    this.setState({ ...this.state, auctionContents });
  }

  render() {
    const { auctionContents } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <TopBanner title={'경매공고'} description={'개인 회원이 필요한 상품에 대해 역경매를 등록할 수 있습니다.'} />
        <Container className={styles.contentContainer}>
          {user === undefined ||
            (user.isBorrower && (
              <div className={styles.buttonWrap}>
                <MarchBlueButton onClick={this.onClickRegisterButton.bind(this)} title={'글쓰기'} />
              </div>
            ))}
          {auctionContents.length === 0 ? (
            <div className={styles.listEmptyNote}>등록된 글이 없습니다.</div>
          ) : (
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>번호</th>
                  <th>제목</th>
                  <th>유저명</th>
                  <th>작성일</th>
                </tr>
                {auctionContents.map((item, index) => {
                  return (
                    <tr className={styles.contentRow} key={index}>
                      <td>{item.id}</td>
                      <td className={styles.contentsTitle}>
                        <Link to={`/auction/content/${item.id}`}>{item.title}</Link>
                      </td>
                      <td className={styles.userColumn}>{item.userName}</td>
                      <td className={styles.timeColumn}>{TimeConverter(item.timeStamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default AuctionBoardVC;
