import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './CommonKeyValueText.scss';

interface CommonKeyValueTextProps {
  title: string;
  value: string;
  className?: string;
}

class CommonKeyValueText extends Component<CommonKeyValueTextProps, {}> {
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

export default CommonKeyValueText;
