import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// styles
import styles from './ArrayTabView.scss';

interface ArrayTabViewProps {
  tabMenus: string[];
  activedIndex: number;
  isBorrower: boolean;
  onClickTabMenu: (index: number) => void;
}

class ArrayTabView extends Component<ArrayTabViewProps, {}> {
  convertMenuToUrl(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .join('');
  }

  render() {
    const { tabMenus, activedIndex, isBorrower } = this.props;
    return (
      <ul
        className={classNames(styles.arrayTabView, {
          [styles.borrower]: isBorrower,
          [styles.lender]: !isBorrower,
        })}
      >
        {tabMenus.map((item, index) => {
          return (
            <li
              className={classNames(styles.tab, { [styles.activated]: index === activedIndex })}
              onClick={() => this.props.onClickTabMenu(index)}
            >
              <Link to={'/' + this.convertMenuToUrl(item)}>{item}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ArrayTabView;
