import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './KeyValueText.scss';

interface KeyValueTextProps {
  title: string;
  value: string;
  className?: string;
}

class KeyValueText extends Component<KeyValueTextProps, {}> {
  render() {
    console.log('key', this.props.title);
    return (
      <div className={classNames(styles.commonKeyValueText, this.props.className)}>
        <p className={styles.title}>{this.props.title}</p>
        <p className={styles.value}>{this.props.value}</p>
      </div>
    );
  }
}

export default KeyValueText;
