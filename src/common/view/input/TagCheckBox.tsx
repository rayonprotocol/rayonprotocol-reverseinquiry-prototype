import React, { Component } from 'react';
import classNames from 'classnames';

// style
import styles from './TagCheckBox.scss';

interface TagCheckBoxProps {
  className?: string;
  name: string; // 불필요해보임
  title: string;
  financeItems: string[];
  selFinanceItems: string[]; 
  isBorrower: boolean; // TODO: isHighligh or isBlue
  onSelChanged: (event) => void;
  // onSelChanged: (item: string, selected: boolean) => void;  // onSelected
}

// TODO: TagCheckboxGroup
class TagCheckBox extends Component<TagCheckBoxProps, {}> {
  state = {
    ...this.state,
    selectedValue: '',
  };

  render() {
    return (
      <div className={classNames(styles.tagCheckBox, this.props.className)}>
        <div className={styles.title}>{this.props.title}</div>
        {this.props.financeItems === undefined ? (
          <div>There is no tag data</div>
        ) : (
          this.props.financeItems.map((item, index) => {
            return (
              <div
                key={index}
                className={classNames(styles.checkBox, {
                  [styles.selected]: this.props.selFinanceItems.indexOf(item) !== -1,
                })}
              >
                <input onChange={this.props.onSelChanged} type={'checkbox'} id={item} name={name} value={item} />
                <label
                  className={classNames(styles.checkBoxLabel, {
                    [styles.borrower]: this.props.isBorrower,
                    [styles.lender]: !this.props.isBorrower,
                  })}
                  htmlFor={item}
                >
                  {item}
                </label>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default TagCheckBox;
