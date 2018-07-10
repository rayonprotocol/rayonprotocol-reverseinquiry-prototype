import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './CommonTextInput.scss';

interface CommonTextInputProps {
  title: string;
  className?: string;
  onChangeInputValue: (event) => void;
}

class CommonTextInput extends Component<CommonTextInputProps, {}> {
  render() {
    return (
      <div className={classNames(styles.commonInputText, this.props.className)}>
        <p className={styles.title}>{this.props.title}</p>
        <input className={styles.textInput} onChange={this.props.onChangeInputValue} type="text" />
      </div>
    );
  }
}

export default CommonTextInput;
