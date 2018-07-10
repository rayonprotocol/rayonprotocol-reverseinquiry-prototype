import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import ContractDC from 'common/dc/ContractDC';

// model
import User, { FinanceData } from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import RayonBlueButton from 'common/view/button/RayonBlueButton';
import CommonRayonButton from 'common/view/button/CommonRayonButton';

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
    alert('Your personal data was successfully saved');
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
        <Container className={styles.contentsContainer}>
          {/* {user.isPassKyc ? ( */}
          <Fragment>
            <div className={styles.titleSection}>
              <p className={styles.title}>Register Data</p>
              <CommonRayonButton
                className={styles.addBtn}
                title={'Add Data'}
                onClickButton={this.onClickAddInputButton.bind(this)}
                isBorrower={true}
              />
            </div>
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Value</th>
                  <th>Remove</th>
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
                        <div onClick={() => this.onClickRemoveInputButton(index)}>x</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <CommonRayonButton
              className={styles.dataSaveBtn}
              title={'Save'}
              onClickButton={this.onClickSubmitButton.bind(this)}
              isBorrower={true}
            />
          </Fragment>
          {/* : (
          <div className={styles.kycRegister}>
          <div className={styles.kycDescription}>Need KYC Validation</div>
          <div className={styles.kycButton}>
          <Link to={'/auth'}>Go</Link>
          </div>
          </div>
          )} */}
        </Container>
      </Fragment>
    );
  }
}

export default RegisterFinanceInfoVC;
