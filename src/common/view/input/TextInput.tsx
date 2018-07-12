import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './TextInput.scss';

interface TextInputProps {
  title: string;
  className?: string;
  onChangeInputValue: (event) => void;
}

class TextInput extends Component<TextInputProps, {}> {
  render() {
    return (
      <div className={classNames(styles.commonInputText, this.props.className)}>
        <p className={styles.title}>{this.props.title}</p>
        <input className={styles.textInput} onChange={this.props.onChangeInputValue} type="text" />
      </div>
    );
  }
}

export default TextInput;
