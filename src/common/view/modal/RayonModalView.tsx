import React, { Component } from 'react';
import Modal from 'react-modal';

interface RayonModalViewProps {
  isModalOpen: boolean;
  onRequestClose: () => void;
}

// styles
import styles from './RayonModalView.scss';

class RayonModalView extends Component<RayonModalViewProps, {}> {
  render() {
    return (
      <Modal
        ariaHideApp={false}
        className={styles.modal}
        isOpen={this.props.isModalOpen}
        onRequestClose={this.props.onRequestClose}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '85%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            borderRadius: '0px',
            border: '0px',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default RayonModalView;
