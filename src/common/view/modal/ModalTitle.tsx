import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './ModalTitle.scss';

interface ModalTitleProps {
  title: string;
  className?: string;
  onCloseRequest: () => void;
}

class ModalTitle extends Component<ModalTitleProps, {}> {
  render() {
    const { title } = this.props;
    return (
      <div className={styles.modalTitle}>
        <span className={classNames(styles.title, this.props.className)}>{title}</span>
        <span className={styles.closeBtn} onClick={this.props.onCloseRequest}>
          X
        </span>
      </div>
    );
  }
}

export default ModalTitle;
