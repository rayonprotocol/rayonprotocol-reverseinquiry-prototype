import React, { Component } from 'react';
import classNames from 'classnames';

// model
import { RAYON_LAKE } from 'common/model/Style';

// styles
import styles from './RayonButton.scss';

interface RayonButtonProps {
  className?: string;
  title: string;
  buttonColor?: string;
  isHidden?: boolean;
  onClickButton: () => void;
}

class RayonButton extends Component<RayonButtonProps, {}> {
  render() {
    return (
      <div
        onClick={this.props.onClickButton}
        className={classNames(styles.commonRayonButton, this.props.className)}
        style={{
          backgroundColor: this.props.buttonColor || RAYON_LAKE,
          display: this.props.isHidden && 'none',
        }}
      >
        {this.props.title}
      </div>
    );
  }
}

export default RayonButton;
