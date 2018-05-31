import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';

// dc
import UserDC from 'user/dc/UserDC';

// controller
import ModalDC from '../dc/ModalDC';

// styles
import styles from './ModalVC.scss';

interface ModalVCProps {
  getIsModalOpen: (modalType: number) => void;
  onClickModal: (modalType: number) => void;
}

class ModalVC extends Component<ModalVCProps, {}> {
  render() {
    const user = UserDC.getUser();
    return (
      <Fragment>
        {ModalDC.modalList.map((item, index) => {
          return (
            <Modal
              key={index}
              ariaHideApp={false}
              className={styles.modal}
              isOpen={this.props.getIsModalOpen(item.modalType)}
              onRequestClose={this.props.onClickModal}
              shouldCloseOnOverlayClick={true}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <item.component user={user} onClickModal={this.props.onClickModal} />
            </Modal>
          );
        })}
      </Fragment>
    );
  }
}

export default ModalVC;
