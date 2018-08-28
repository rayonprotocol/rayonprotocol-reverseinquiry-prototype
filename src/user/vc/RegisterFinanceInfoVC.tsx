import React, { Component } from 'react';

// model
import User, { KeyValueObject } from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import RayonButton from 'common/view/button/RayonButton';
import RegisterSuccessModelView from 'user/view/RegisterSuccessModelView';

// styles
import styles from './RegisterFinanceInfoVC.scss';

interface RegisterFinanceInfoVCState {
  financeData: KeyValueObject[];
  inputLength: number;
  user: User;
  isSuccessModalOpen: boolean;
}

class RegisterFinanceInfoVC extends Component<{}, RegisterFinanceInfoVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      inputLength: 1,
      financeData: new Array<KeyValueObject>(),
      user: UserDC.getUser(),
      isSuccessModalOpen: false,
    };
  }

  componentWillMount(): void {
    const userFinanceData = UserDC.getUserFinanceData();
    userFinanceData === null ? this.addEmptyFinanceData() : this.makeFinanceDataObjectToKeyValueArray(userFinanceData);
  }

  addEmptyFinanceData(): void {
    this.state.financeData.push(this.makeFinanceData('', ''));
  }

  makeFinanceDataObjectToKeyValueArray(userFinanceData: Object): void {
    const financeDataKeys = Object.keys(userFinanceData);

    financeDataKeys.map(key => this.state.financeData.push(this.makeFinanceData(key, userFinanceData[key])));
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  makeFinanceData(key: any, value: any): KeyValueObject {
    const newFinanceData = {
      objectKey: key,
      objectValue: value,
    };
    return newFinanceData;
  }

  onChangeDataKeyText(event, index: number): void {
    this.state.financeData[index].objectKey = event.target.value;
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onChangeDataValueText(event, index: number): void {
    this.state.financeData[index].objectValue = event.target.value;
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onRequestModalOpenStateToggle(): void {
    // break out when click open button, modal background, close button
    this.setState({ ...this.state, isSuccessModalOpen: !this.state.isSuccessModalOpen });
  }

  onClickAddInputButton(): void {
    this.addEmptyFinanceData();
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onClickRemoveInputButton(index: number): void {
    if (this.state.financeData.length === 1) {
      alert("can't remove last property");
    } else {
      this.state.financeData.splice(index, 1);
      this.setState({ ...this.state, financeData: this.state.financeData });
    }
  }

  onClickSubmitButton(): void {
    localStorage.setItem(UserDC.getUserAccount(), this.stringifyFinanceData());
    this.onRequestModalOpenStateToggle();
  }

  stringifyFinanceData(): string {
    const object: Object = new Object();
    this.state.financeData.forEach(item => {
      object[item.objectKey] = item.objectValue;
    });
    return JSON.stringify(object);
  }

  renderRegisterDataTable() {
    return (
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
                    value={this.state.financeData[index].objectKey}
                  />
                </td>
                <td>
                  <input
                    onChange={event => this.onChangeDataValueText(event, index)}
                    type={'text'}
                    value={this.state.financeData[index].objectValue}
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
    );
  }

  render() {
    console.log('financeData', this.state.financeData);
    return (
      <Container className={styles.contentsContainer}>
        <div className={styles.titleSection}>
          <p className={styles.title}>Register Data</p>
          <RayonButton
            className={styles.addBtn}
            title={'Add Data'}
            onClickButton={this.onClickAddInputButton.bind(this)}
            buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
          />
        </div>
        {this.renderRegisterDataTable()}
        <RayonButton
          className={styles.dataSaveBtn}
          title={'Save'}
          onClickButton={this.onClickSubmitButton.bind(this)}
          buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
        />

        <RegisterSuccessModelView
          onRequestCloseModal={this.onRequestModalOpenStateToggle.bind(this)}
          isModalOpen={this.state.isSuccessModalOpen}
          buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
        />
      </Container>
    );
  }
}

export default RegisterFinanceInfoVC;
