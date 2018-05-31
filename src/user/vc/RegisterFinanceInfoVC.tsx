import React, { Component, Fragment } from 'react';

import ContractDC from 'common/dc/ContractDC';

// model
import { FinanceData } from 'user/model/User';

// view
import Container from 'common/view/Container';
import MarchBlueButton from 'common/view/button/MarchBlueButton';
import TopBanner from 'common/view/banner/TopBanner';

// styles
import styles from './RegisterFinanceInfoVC.scss';

interface RegisterFinanceInfoVCState {
  financeData: FinanceData[];
  inputLength: number;
}

class RegisterFinanceInfoVC extends Component<{}, RegisterFinanceInfoVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      inputLength: 1,
      financeData: [new FinanceData()],
    };
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
    financeData.splice(index, 1);
    this.setState({ ...this.state, financeData });
  }

  render() {
    const { financeData } = this.state;
    return (
      <Fragment>
        <TopBanner title={'금융정보등록'} description={'입력해주신 금융정보는 로컬에 저장됩니다'} />
        <Container className={styles.contentsContainer}>
          <div className={styles.addBtn}>
            <div onClick={this.onClickAddInputButton.bind(this)}>항목추가</div>
          </div>
          <table>
            <tbody>
              <tr className={styles.headerRow}>
                <th>id</th>
                <th>key</th>
                <th>value</th>
                <th>remove</th>
              </tr>
              {this.state.financeData.map((item, index) => {
                return (
                  <tr key={index} className={styles.inputRow}>
                    <td className={styles.id}>{index}</td>
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
            <MarchBlueButton onClick={this.onClickSubmitButton.bind(this)} title={'입력'} />
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default RegisterFinanceInfoVC;
