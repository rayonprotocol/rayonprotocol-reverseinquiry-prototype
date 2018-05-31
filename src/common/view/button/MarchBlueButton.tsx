import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './MarchBlueButton.scss';

interface MarchBlueButtonProps {
  className?: string;
  title: string;
  onClick: () => void;
}

class MarchBlueButton extends Component<MarchBlueButtonProps, {}>{
  render() {
    return (
      <div onClick={this.props.onClick} className={classNames(styles.blueButton, this.props.className)}>
        {this.props.title}
      </div>
    )
  }
}

export default MarchBlueButton;