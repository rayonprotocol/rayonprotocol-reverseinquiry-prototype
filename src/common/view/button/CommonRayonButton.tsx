import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './CommonRayonButton.scss';

interface CommonRayonButtonProps {
  title: string;
  className?: string;
  isBorrower: boolean;
  onClickButton: () => void;
}

class CommonRayonButton extends Component<CommonRayonButtonProps, {}> {
  render() {
    return (
      <div
        onClick={this.props.onClickButton}
        className={classNames(styles.commonRayonButton, this.props.className, {
          [styles.borrower]: this.props.isBorrower,
          [styles.lender]: !this.props.isBorrower,
        })}
      >
        {this.props.title}
      </div>
    );
  }
}

export default CommonRayonButton;
