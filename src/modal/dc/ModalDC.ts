import ModalForm from '../model/ModalForm';

// view
import SignUpVC from 'user/vc/SignUpVC';

class ModalDC {
  modalList: ModalForm[];
  constructor() {
    this.modalList = [
      {
        modalType: ModalForm.SIGNUP_MODAL,
        component: SignUpVC,
      },
    ];
  }
}

export default new ModalDC();
