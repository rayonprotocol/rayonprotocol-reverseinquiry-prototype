import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './TagView.scss';

interface TagViewProps {
  className?: string;
  tag: string;
  color: string;
}

class TagView extends Component<TagViewProps, {}> {
  render() {
    return (
      <div
        className={classNames(styles.tag, this.props.className)}
        style={{ borderColor: this.props.color, color: this.props.color }}
      >
        {this.props.tag}
      </div>
    );
  }
}

export default TagView;
