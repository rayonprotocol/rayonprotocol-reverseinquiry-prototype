// agent
import UserServerAgent from 'user/agent/UserServerAgent';

// model
import User from '../model/User';

// dc
import ContractDC from 'common/dc/ContractDC';

// util

class UserDC {
  static ACCOUNT_WATCH_INTERVAL = 500; // ms
  private user: User;
  private userListeners: Array<{ compName: string; fn: (user: User) => void }>;
  private accountInterval;

  constructor() {
    this.user = undefined;
    this.userListeners = [];
    this.watchWeb3Account();
  }

  private watchWeb3Account = () => {
    if (this.accountInterval !== undefined) clearInterval(this.accountInterval);

    this.accountInterval = setInterval(() => {
      if (!window['web3']) return;
      const [currentAccount] = window['web3']['eth']['accounts'];
      if (currentAccount !== ContractDC.getAccount()) {
        ContractDC.account = currentAccount;
        this.userLogIn();
      }
    }, UserDC.ACCOUNT_WATCH_INTERVAL);
  };

  public addUserListener(compName: string, fn: (user: User) => void) {
    if (!this.userListeners.find(listener => listener.compName === compName)) {
      this.userListeners.push({ compName, fn });
    }
  }

  public removeUserListener(compName: string) {
    const found = this.userListeners.find(listener => listener.compName === compName);
    if (found) {
      const index = this.userListeners.indexOf(found);
      this.userListeners.splice(index, 1);
    }
  }
  // 유저 호출
  public getUser = (): User => {
    if (!this.user) this.userLogIn();
    return this.user;
  };

  async getUserFromBlockchain(account: string) {
    return UserServerAgent.fetchUser(account);
  }

  // 회원 가입
  async userSignUp(userName: string, isBorrower: boolean) {
    UserServerAgent.userSignUp(userName, isBorrower);
  }

  async userLogIn() {
    const currentUser = this.user;
    const newUser = await UserServerAgent.userAuth();
    if (currentUser !== newUser) {
      this.user = newUser;
      this.userListeners.forEach(listener => listener.fn(newUser));
    }
  }

  async userAuth() {
    this.user.isPassKyc = await UserServerAgent.userAuth();
  }
}

export default new UserDC();
