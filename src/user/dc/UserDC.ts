// agent
import UserServerAgent from 'user/agent/UserServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import User from '../model/User';
import { RayonEvent, RayonEventResponse, LogSignUpEventArgs } from 'common/model/RayonEvent';
import { listeners } from 'cluster';

type EventListner = (event) => void;

class UserDC extends RayonDC {
  constructor() {
    super();
    UserServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogSignUpUser:
        this.onLogSignUpEvent(event);
        break;
      default:
        break;
    }
  }

  private onLogSignUpEvent(event: RayonEventResponse<LogSignUpEventArgs>) {
    if (event.args.userAddress !== UserServerAgent.getUserAccount()) return;
    this._eventListeners[RayonEvent.LogSignUpUser] &&
      this._eventListeners[RayonEvent.LogSignUpUser].forEach(listner => {
        listner(event);
      });
  }

  /*
  Request functions to blockchain via server agent
  */

  public async fetchUser() {
    const user = await UserServerAgent.fetchUser();
    return user;
  }

  public async isUser() {
    const isUser = await UserServerAgent.isUser();
    return isUser;
  }

  public signUp(userName: string, isBorrower: boolean) {
    UserServerAgent.signUp(userName, isBorrower);
  }

  /*
  common function
  */
}

export default new UserDC();
