import React, { Component, Fragment } from 'react';

// dc
import ContractDC from 'common/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';

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
    this.setState({ ...this.state, user });
  };
  render() {
    const { financeData, user } = this.state;
    console.log('financeData', financeData);
    return (
      <Fragment>
        <Container className={styles.contentsContainer}>
          <div className={styles.value}>
            <div className={styles.subTitle}>User ID</div>
            <div>{user.userName}</div>
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>Wallet Address</div>
            <div className={styles.userAddress}>{user.userAddress}</div>
          </div>
          <div className={styles.value}>
            <div className={styles.subTitle}>Account Type</div>
            <div className={styles.joinType}>{user.isBorrower ? 'Borrower' : 'Lender'}</div>
          </div>
          {user.isBorrower && (
            <Fragment>
              <div className={styles.value}>
                <div className={styles.subTitle}>KYC Status</div>
                {user.isPassKyc ? (
                  <div className={styles.successAuth}>Complete</div>
                ) : (
                  <div className={styles.needAuth}>Required</div>
                )}
              </div>
              <div className={styles.value}>
                <div className={styles.subTitle}>My Personal Data</div>
                {financeData === null ? (
                  <div>{'No personal data registered'}</div>
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
            </Fragment>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default MyPageVC;
