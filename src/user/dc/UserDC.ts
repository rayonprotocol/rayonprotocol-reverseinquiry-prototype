// agent
import UserServerAgent from 'user/agent/UserServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import User from '../model/User';
import { RayonEvent, RayonEventResponse, LogUserSignUpArgs } from 'common/model/RayonEvent';

type UserListner = (user: User) => void;

class UserDC extends RayonDC {
  private _user: User;
  private _userListeners: Set<UserListner>;

  constructor() {
    super();
    this._userListeners = new Set();
    UserServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogUserSignUp:
        this.onLogUserSignUp(event);
        break;
      default:
        break;
    }
  }

  private onLogUserSignUp(event: RayonEventResponse<LogUserSignUpArgs>) {
    if (event.args.userAddress !== this.getUserAccount()) return;
    this._eventListeners[RayonEvent.LogUserSignUp] &&
      this._eventListeners[RayonEvent.LogUserSignUp].forEach(listner => {
        listner(event);
      });
  }

  /*
  user handler
  */
  public addUserListeners(listener: UserListner) {
    this._userListeners.add(listener);
  }

  public removeUserListeners(listener: UserListner) {
    this._userListeners.delete(listener);
  }

  private onUserFetched(user: User) {
    this._userListeners && this._userListeners.forEach(listener => listener(user));
  }

  /*
  Request functions to blockchain via server agent
  */

  public async fetchUser() {
    if (this._user !== undefined) {
      this.onUserFetched(this._user);
      return;
    }

    this._user = await UserServerAgent.fetchUser();
    this.onUserFetched(this._user);
  }

  public async isUser() {
    return await UserServerAgent.isUser();
  }

  public signUp(userName: string, isBorrower: boolean) {
    UserServerAgent.signUp(userName, isBorrower);
  }

  /*
  common function
  */
  public getUser() {
    return this._user;
  }
}

export default new UserDC();
