import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './TextInput.scss';

interface TextInputProps {
  title: string;
  className?: string;
  onChangeInputValue: (text: string) => void;
}

class TextInput extends Component<TextInputProps, {}> {
  render() {
    return (
      <div className={classNames(styles.commonInputText, this.props.className)}>
        <p className={styles.title}>{this.props.title}</p>
        <input
          className={styles.textInput}
          onChange={event => this.props.onChangeInputValue(event.target.value)}
          type="text"
        />
      </div>
    );
  }
}

export default TextInput;
