import React, { Component, Fragment } from 'react';

// dc
import ContractDC from 'common/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/Container';
import TopBanner from 'common/view/banner/TopBanner';

// model
import User from 'user/model/User';

// styles
import styles from './MyPageVC.scss';

interface MyPageVCProps {}

interface MyPageVCState {
  financeData: string;
  user: User;
}

class MyPageVC extends Component<MyPageVCProps, MyPageVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      financeData: localStorage.getItem(ContractDC.getAccount()),
      user: UserDC.getUser(),
    };
  }
  componentDidMount() {
    UserDC.addUserListener(MyPageVC.name, this.onUpdateUser);
  }
  componentWillUnmount() {
    UserDC.removeUserListener(MyPageVC.name);
  }

  onUpdateUser = (user: User) => {
    console.log({ user });
    this.setState({ ...this.state, user });
  };
  render() {
    const { financeData, user } = this.state;
    console.log('financeData', financeData);
    return (
      <Fragment>
        <TopBanner title={'마이페이지'} description={'회원님의 정보는 암호화되어 관리됩니다'} />
        <Container className={styles.contentsContainer}>
          <div className={styles.value}>
            <div className={styles.subTitle}>닉네임</div>
            <div>{user.userName}</div>
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>계좌 주소</div>
            <div className={styles.userAddress}>{user.userAddress}</div>
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>가입유형</div>
            <div className={styles.joinType}>{user.isPersonal ? 'Personal' : 'FI'}</div>
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>인증 상태</div>
            {user.isPassKyc ? (
              <div className={styles.successAuth}>인증완료</div>
            ) : (
              <div className={styles.needAuth}>인증필요</div>
            )}
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>회원님의 금융데이터</div>
            {financeData === null ? (
              <div>{'아직 금융데이터가 등록되지 않았습니다'}</div>
            ) : (
              Object.keys(JSON.parse(financeData)).map((item, index) => {
                return (
                  <div className={styles.financeData} key={index}>
                    {item} : {JSON.parse(financeData)[item]}
                  </div>
                );
              })
            )}
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default MyPageVC;
