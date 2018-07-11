import React, { Component } from 'react';

// styles
import styles from './ThreeValueText.scss';

interface ThreeValueTextProps {
  title: string;
  firstValue: string;
  secondValue: string;
}

class ThreeValueTextText extends Component<ThreeValueTextProps, {}> {
  render() {
    const { title, firstValue, secondValue } = this.props;
    return (
      <div className={styles.multipleValueText}>
        <div className={styles.title}>{title}</div>
        <div className={styles.firstValue}>{firstValue}</div>
        <div className={styles.secondValue}>{secondValue}</div>
      </div>
    );
  }
}

export default ThreeValueTextText;
