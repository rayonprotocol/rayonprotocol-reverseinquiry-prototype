import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// util
import StringUtil from 'common/util/StringUtil';

// styles
import styles from './ArrayTab.scss';

interface ArrayTabProps {
  tabMenus: string[];
  activedTabIndex: number;
  backgroundColor: string;
  onClickTabMenu: (index: number) => void;
}

class ArrayTab extends Component<ArrayTabProps, {}> {
  render() {
    return (
      <ul className={styles.arrayTabView} style={{ backgroundColor: this.props.backgroundColor }}>
        {this.props.tabMenus.map((menu, index) => {
          return (
            <li
              key={index}
              className={classNames(styles.tab, { [styles.activated]: index === this.props.activedTabIndex })}
              onClick={() => this.props.onClickTabMenu(index)}
            >
              <Link className={styles.link} to={'/' + StringUtil.ChangeToUrlFormat(menu)}>
                {menu}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ArrayTab;
