import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './TagCheckbox.scss';

interface TagCheckboxProps {
  label?: string;
  checked: boolean;
  tagColor: string;
  onTagChecked: (label: any) => void;
}

class TagCheckbox extends Component<TagCheckboxProps, {}> {
  handleClick = () => this.props.onTagChecked(this.props.label);

  render() {
    return (
      <div
        className={classNames(styles.checkBox, {
          [styles.selected]: this.props.checked,
        })}
      >
        <input onChange={this.handleClick} type={'checkbox'} id={this.props.label} value={this.props.label} />
        <label
          className={classNames(styles.checkBoxLabel)}
          style={{
            borderColor: this.props.tagColor,
            color: this.props.checked ? 'white' : this.props.tagColor,
            backgroundColor: this.props.checked ? 'white' : this.props.tagColor,
          }}
          htmlFor={this.props.label}
        >
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default TagCheckbox;
