import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './RayonBlueButton.scss';

interface RayonBlueButtonProps {
  className?: string;
  title: string;
  onClick: () => void;
}

class RayonBlueButton extends Component<RayonBlueButtonProps, {}> {
  render() {
    return (
      <div onClick={this.props.onClick} className={classNames(styles.blueButton, this.props.className)}>
        {this.props.title}
      </div>
    );
  }
}

export default RayonBlueButton;
