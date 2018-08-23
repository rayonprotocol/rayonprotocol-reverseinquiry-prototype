import React, { Component } from 'react';
import classNames from 'classnames';

// view
import TagCheckbox from 'common/view/input/TagCheckbox';

// util
import ArrayUtil from 'common/util/ArrayUtil';

// style
import styles from './TagCheckboxGroup.scss';

interface TagCheckboxGroupProps {
  className?: string;
  title: string;
  tags: string[];
  selTags: Set<string>;
  tagColor: string;
  onTagChecked: (tag: any) => void;
}

class TagCheckboxGroup extends Component<TagCheckboxGroupProps, {}> {
  renderNoTags() {
    return <div>There is no tag data</div>;
  }

  renderTagGroup() {
    return this.props.tags.map((tag, index) => {
      return (
        <TagCheckbox
          key={index}
          label={tag}
          checked={this.props.selTags.has(tag)}
          tagColor={this.props.tagColor}
          onTagChecked={this.props.onTagChecked}
        />
      );
    });
  }

  render() {
    return (
      <div className={classNames(styles.tagCheckBox, this.props.className)}>
        <div className={styles.title}>{this.props.title}</div>
        {ArrayUtil.isEmpty(this.props.tags) ? this.renderNoTags() : this.renderTagGroup()}
      </div>
    );
  }
}

export default TagCheckboxGroup;
