import React, { Component } from 'react';
import classNames from 'classnames';

// style
import styles from './ToggleButton.scss';

interface ToggleButtonProps {
  className?: string;
  title: string;
  dataList: string[];
  name: string;
  onChangeToggleButton: (event) => void;
}

interface ToggleButtonState {
  selectedValue: string;
}

class ToggleButton extends Component<ToggleButtonProps, ToggleButtonState> {
  state = {
    ...this.state,
    selectedValue: '',
  };

  handleChangeToggleButton(event) {
    const selectedValue = event.target.value;
    this.props.onChangeToggleButton(event);
    this.setState({ ...this.state, selectedValue });
  }

  render() {
    const { dataList, name, title } = this.props;
    const { selectedValue } = this.state;
    return (
      <div className={classNames(styles.toggleButton, this.props.className)}>
        <div className={styles.title}>{title}</div>
        {dataList.map((item, index) => {
          return (
            <div key={index} className={classNames(styles.radioButton, { [styles.selected]: item === selectedValue })}>
              <input
                onChange={this.handleChangeToggleButton.bind(this)}
                type={'radio'}
                id={item}
                name={name}
                value={item}
              />
              <label className={styles.toggleLabel} htmlFor={item}>
                {item}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ToggleButton;
