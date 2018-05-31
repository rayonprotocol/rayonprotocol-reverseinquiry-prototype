import ModalForm from '../model/ModalForm';

// view
import SignUpVC from 'user/vc/SignUpVC';
import AuthVC from 'user/vc/AuthVC';

class ModalDC {
  modalList: ModalForm[];
  constructor() {
    this.modalList = [
      {
        modalType: ModalForm.SIGNUP_MODAL,
        component: SignUpVC,
      },
      {
        modalType: ModalForm.AUTH_MODAL,
        component: AuthVC,
      },
    ];
  }
}

export default new ModalDC();
