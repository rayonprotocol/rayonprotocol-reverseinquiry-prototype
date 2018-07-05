import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import ContractDC from 'common/dc/ContractDC';

// model
import User, { FinanceData } from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';
import TopBanner from 'common/view/banner/TopBanner';

// styles
import styles from './RegisterFinanceInfoVC.scss';

interface RegisterFinanceInfoVCState {
  financeData: FinanceData[];
  inputLength: number;
  user: User;
}

class RegisterFinanceInfoVC extends Component<{}, RegisterFinanceInfoVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      inputLength: 1,
      financeData: [new FinanceData()],
      user: UserDC.getUser(),
    };
  }

  componentWillMount() {
    const storeData = JSON.parse(localStorage.getItem(ContractDC.getAccount()));
    const keys = Object.keys(storeData);
    let financeData: FinanceData[] = [];

    if (storeData === null) return;

    keys.map(item => {
      let newFinanceData: FinanceData = new FinanceData();
      newFinanceData.dataKeys = item;
      newFinanceData.dataValues = storeData[item];
      financeData.push(newFinanceData);
    });

    this.setState({ ...this.state, financeData });
  }

  onChangeDataKeyText(event, index: number) {
    this.state.financeData[index].dataKeys = event.target.value;
    this.setState(this.state);
  }

  onChangeDataValueText(event, index: number) {
    this.state.financeData[index].dataValues = event.target.value;
    this.setState(this.state);
  }

  async onClickSubmitButton() {
    const object: Object = {};
    this.state.financeData.forEach(item => {
      object[item.dataKeys] = item.dataValues;
    });
    localStorage.setItem(ContractDC.getAccount(), JSON.stringify(object));
    this.setState({ ...this.state, financeData: [new FinanceData()] });
    alert('성공적으로 금융 데이터 등록이 완료되었습니다!');
  }

  onClickAddInputButton() {
    const newFinanceData = new FinanceData();
    this.state.financeData.push(newFinanceData);
    this.setState(this.state);
  }

  onClickRemoveInputButton(index: number) {
    const { financeData } = this.state;
    if (financeData.length === 1) return alert("can't remove last property");
    financeData.splice(index, 1);
    this.setState({ ...this.state, financeData });
  }

  render() {
    const { financeData, user } = this.state;
    return (
      <Fragment>
        <TopBanner title={'Register Personal Data'} description={''} />
        <Container className={styles.contentsContainer}>
          {user.isPassKyc ? (
            <Fragment>
              <div className={styles.addBtn}>
                <div onClick={this.onClickAddInputButton.bind(this)}>Add</div>
              </div>
              <table>
                <tbody>
                  <tr className={styles.headerRow}>
                    <th>ID</th>
                    <th>key</th>
                    <th>value</th>
                    <th>remove</th>
                  </tr>
                  {this.state.financeData.map((item, index) => {
                    return (
                      <tr key={index} className={styles.inputRow}>
                        <td className={styles.id}>{index + 1}</td>
                        <td>
                          <input
                            onChange={event => this.onChangeDataKeyText(event, index)}
                            type={'text'}
                            value={financeData[index].dataKeys}
                          />
                        </td>
                        <td>
                          <input
                            onChange={event => this.onChangeDataValueText(event, index)}
                            type={'text'}
                            value={financeData[index].dataValues}
                          />
                        </td>
                        <td className={styles.removeBtn}>
                          <div onClick={() => this.onClickRemoveInputButton(index)}>-</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className={styles.buttonWrap}>
                <MarchBlueButton onClick={this.onClickSubmitButton.bind(this)} title={'Save'} />
              </div>
            </Fragment>
          ) : (
            <div className={styles.kycRegister}>
              <div className={styles.kycDescription}>Need KYC Validation</div>
              <div className={styles.kycButton}>
                <Link to={'/auth'}>button</Link>
              </div>
            </div>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default RegisterFinanceInfoVC;
