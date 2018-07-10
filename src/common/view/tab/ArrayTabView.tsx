import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './ArrayTabView.scss';

interface ArrayTabViewProps {
  tabMenus: string[];
  activedIndex: number;
  onClickTabMenu: (index: number) => void;
}

class ArrayTabView extends Component<ArrayTabViewProps, {}> {
  render() {
    const { tabMenus, activedIndex } = this.props;
    return (
      <ul className={styles.arrayTabView}>
        {tabMenus.map((item, index) => {
          return (
            <li
              className={classNames(styles.tab, { [styles.activated]: index === activedIndex })}
              onClick={() => this.props.onClickTabMenu(index)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ArrayTabView;
