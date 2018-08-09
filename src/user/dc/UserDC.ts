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

  /*
  related to event functions
  */

  public addUserListener(listener: UserListner) {
    !this.userListeners.has(listener) && this.userListeners.add(listener);
  }

  public removeUserListener(listener: UserListner) {
    this.userListeners.has(listener) && this.userListeners.delete(listener);
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    console.log('event', event);
    switch (eventType) {
      case RayonEvent.LogSignUpUser:
        this.onLogSignUpUserEvent(event);
        break;
      default:
        break;
    }
  }

  private onLogSignUpUserEvent(event) {
    console.log(event);
  }

  /*
  Request functions to blockchain via server agent
  */

  public async fetchUser() {
    const user = await UserServerAgent.fetchUser();
    this.userListeners.forEach(listener => listener(user));
  }

  public async isUser() {
    const isUser = await UserServerAgent.isUser();
    return isUser;
  }

  public signUp(userName: string, isBorrower: boolean) {
     UserServerAgent.signUp(userName, isBorrower);
  }
}

export default new UserDC();
