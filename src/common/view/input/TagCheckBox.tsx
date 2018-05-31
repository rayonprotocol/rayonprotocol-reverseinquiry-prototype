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
  onChangeCheckBox: (event) => void;
}

class TagCheckBox extends Component<TagCheckBoxProps, {}> {
  state = {
    ...this.state,
    selectedValue: '',
  };

  render() {
    const { dataList, name, title, selectedList } = this.props;
    return (
      <div className={classNames(styles.tagCheckBox, this.props.className)}>
        <div className={styles.title}>{title}</div>
        {dataList === undefined ? (
          <div>태그 데이터가 없습니다</div>
        ) : (
          dataList.map((item, index) => {
            return (
              <div
                key={index}
                className={classNames(styles.checkBox, { [styles.selected]: selectedList.indexOf(item) !== -1 })}
              >
                <input onChange={this.props.onChangeCheckBox} type={'checkbox'} id={item} name={name} value={item} />
                <label className={styles.checkBoxLabel} htmlFor={item}>
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
