import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './FocusAniInput.scss';

interface FocusAniInputProps {
  title: string;
  isTextArea?: boolean;
  onChangeInput: (event) => void;
}

interface FocusAniInputState {
  focused: boolean;
  isInputEmpty: boolean;
}

class FocusAniInput extends Component<FocusAniInputProps, FocusAniInputState> {
  state = {
    ...this.state,
    focused: false,
    isInputEmpty: true,
  };

  onClickInput(focused: boolean) {
    this.setState({ ...this.state, focused });
  }

  onChangeInputValue(event) {
    const isInputEmpty = event.target.value === undefined || event.target.value === '';
    this.setState({ ...this.state, isInputEmpty });
    this.props.onChangeInput(event);
  }

  render() {
    const { title, isTextArea } = this.props;
    const { isInputEmpty, focused } = this.state;
    return (
      <div className={classNames(styles.formGroup, { [styles.focused]: !isInputEmpty || focused })}>
        <label className={styles.formLabel} htmlFor={'first'}>
          {title}
        </label>
        {isTextArea ? (
          <textarea
            id={'first'}
            cols={30}
            rows={10}
            className={styles.formInput}
            onFocus={() => this.onClickInput(true)}
            onBlur={() => this.onClickInput(false)}
            onChange={event => this.onChangeInputValue(event)}
          />
        ) : (
          <input
            id={'first'}
            className={styles.formInput}
            type={'text'}
            onFocus={() => this.onClickInput(true)}
            onBlur={() => this.onClickInput(false)}
            onChange={event => this.onChangeInputValue(event)}
          />
        )}
      </div>
    );
  }
}

export default FocusAniInput;
