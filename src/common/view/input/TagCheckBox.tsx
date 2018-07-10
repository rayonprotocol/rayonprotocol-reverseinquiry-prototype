import React, { Component } from 'react';
import classNames from 'classnames';

// style
import styles from './TagCheckBox.scss';

interface TagCheckBoxProps {
  className?: string;
  title: string;
  dataList: string[];
  selectedList: string[];
  name: string;
  isBorrower: boolean;
  onChangeCheckBox: (event) => void;
}

class TagCheckBox extends Component<TagCheckBoxProps, {}> {
  state = {
    ...this.state,
    selectedValue: '',
  };

  render() {
    const { dataList, name, title, selectedList, isBorrower } = this.props;
    return (
      <div className={classNames(styles.tagCheckBox, this.props.className)}>
        <div className={styles.title}>{title}</div>
        {dataList === undefined ? (
          <div>There is no tag data</div>
        ) : (
          dataList.map((item, index) => {
            return (
              <div
                key={index}
                className={classNames(styles.checkBox, {
                  [styles.selected]: selectedList.indexOf(item) !== -1,
                })}
              >
                <input onChange={this.props.onChangeCheckBox} type={'checkbox'} id={item} name={name} value={item} />
                <label
                  className={classNames(styles.checkBoxLabel, {
                    [styles.borrower]: isBorrower,
                    [styles.lender]: !isBorrower,
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
