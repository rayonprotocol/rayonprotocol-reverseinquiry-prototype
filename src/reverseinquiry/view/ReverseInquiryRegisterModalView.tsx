import React, { Component } from 'react';

// model
import User from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// view
import TextInput from 'common/view/input/TextInput';
import ModalTitle from 'common/view/modal/ModalTitle';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';
import TagCheckboxGroup from 'common/view/input/TagCheckboxGroup';

// styles
import styles from './ReverseInquiryRegisterModalView.scss';

interface ReverseInquiryRegisterModalViewProps {
  isModalOpen: boolean;
  onRequestModalClose: () => void;
}

interface ReverseInquiryRegisterModalViewState {
  user: User;
  title: string;
  content: string;
  userFinanceData: Object;
  selAvailableFinanceData: Set<string>;
}

class ReverseInquiryRegisterModalView extends Component<
  ReverseInquiryRegisterModalViewProps,
  ReverseInquiryRegisterModalViewState
> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      user: UserDC.getUser(),
      userFinanceData: UserDC.getUserFinanceData(),
      selAvailableFinanceData: new Set<string>(),
    };
  }

  async onClickRegisterButton(): Promise<void> {
    if (this.state.selAvailableFinanceData.size === 0) {
      alert('Personal data must be provided with loan request');
      return;
    }
    try {
      ReverseInquiryDC.registerReverseInquiry(
        this.state.title,
        this.state.content,
        Array.from(this.state.selAvailableFinanceData)
      );
      this.props.onRequestModalClose();
    } catch {
      console.error('ReverseInquiry register failed');
    }
  }

  onChangeTitle(event): void {
    this.setState({ ...this.state, title: event.target.value });
  }

  onChangeContent(event): void {
    this.setState({ ...this.state, content: event.target.value });
  }

  onChangeTag(tag: string): void {
    this.state.selAvailableFinanceData.has(tag)
      ? this.state.selAvailableFinanceData.delete(tag)
      : this.state.selAvailableFinanceData.add(tag);
    this.setState({ ...this.state, selAvailableFinanceData: this.state.selAvailableFinanceData });
  }

  render() {
    return (
      <RayonModalView isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onRequestModalClose}>
        <div>
          <div className={styles.note}>
            <ModalTitle
              className={styles.noticeTitle}
              title={'New Request'}
              onCloseRequest={this.props.onRequestModalClose}
            />
            <p>Notice</p>
            <p>1. Wallet Address and User ID are automatically filled in</p>
            <p>2. Revisions cannot be made once published so user attention is advised</p>
          </div>
          <TextInput title={'Title'} onChangeInputValue={this.onChangeTitle.bind(this)} />
          <TextInput title={'Content'} onChangeInputValue={this.onChangeContent.bind(this)} />
          {this.state.userFinanceData && (
            <TagCheckboxGroup
              className={styles.FinanceTag}
              title={'personal data to be provided'}
              tags={Object.keys(this.state.userFinanceData)}
              selTags={this.state.selAvailableFinanceData}
              onTagChecked={this.onChangeTag.bind(this)}
              tagColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          )}
          <RayonButton
            title={'Submit'}
            className={styles.buttonWrap}
            onClickButton={this.onClickRegisterButton.bind(this)}
            buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
          />
        </div>
      </RayonModalView>
    );
  }
}

export default ReverseInquiryRegisterModalView;
