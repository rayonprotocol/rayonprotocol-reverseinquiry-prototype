import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './Container.scss';

interface ContainerProps {
  className?: string;
  noTopPadding?: boolean;
}

class Container extends Component<ContainerProps, {}> {
  render() {
    return (
      <div className={classNames(styles.container, this.props.className, { [styles.noTopPadding]: this.props.noTopPadding })}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
