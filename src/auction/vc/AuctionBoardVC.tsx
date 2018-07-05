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
        <TopBanner title={'Loan Requests'} description={''} />
        <Container className={styles.contentContainer}>
          {user === undefined ||
            (user.isBorrower && (
              <div className={styles.buttonWrap}>
                <MarchBlueButton onClick={this.onClickRegisterButton.bind(this)} title={'New Request'} />
              </div>
            ))}
          {auctionContents.length === 0 ? (
            <div className={styles.listEmptyNote}>No Requests To Date</div>
          ) : (
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>No.</th>
                  <th>Title</th>
                  <th>User ID</th>
                  <th>Date</th>
                </tr>
                {auctionContents.map((item, index) => {
                  return (
                    <tr className={styles.contentRow} key={index}>
                      <td>{item.id + 1}</td>
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
