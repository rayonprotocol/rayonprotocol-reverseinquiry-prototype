// agent
import UserServerAgent from 'user/agent/UserServerAgent';

// model
import User from '../model/User';
import { RayonEvent } from 'common/model/RayonEvent';

type UserListner = (user: User) => void;

class UserDC {
  private user: User;
  private userListeners: Set<UserListner>;

  constructor() {
    this.userListeners = new Set();
    UserServerAgent.setEventListner(this.onEvent.bind(this));
  }

  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogAuthUser:
        this.onLogAuthUserEvent(event);
        break;
      case RayonEvent.LogSignUpUser:
        this.onLogSignUpUserEvent(event);
        break;
      default:
        break;
    }
  }

  private onLogAuthUserEvent(event) {
    console.log(event);
  }

  private onLogSignUpUserEvent(event) {
    console.log(event);
  }

  async fetchUser() {
    const result = await UserServerAgent.fetchUser();
    console.log(result);
    // this.userListeners.forEach(listener => listener(user));
  }

  /*
  */
  public addUserListener(listener: UserListner) {
    !this.userListeners.has(listener) && this.userListeners.add(listener);
  }

  public removeUserListener(listener: UserListner) {
    this.userListeners.has(listener) && this.userListeners.delete(listener);
  }

  // 회원 가입
  async userSignUp(userName: string, isBorrower: boolean) {
    UserServerAgent.userSignUp(userName, isBorrower);
  }

  async userAuth() {
    this.user.isPassKyc = await UserServerAgent.userAuth();
  }
}

export default new UserDC();
