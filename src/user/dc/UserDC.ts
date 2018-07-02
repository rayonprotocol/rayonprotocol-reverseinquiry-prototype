// model
import User from '../model/User';
import { ContractEvent } from 'common/model/CommonModel';

// dc
import ContractDC, { ContractInstance } from 'common/dc/ContractDC';

// util
import parseTransactionResult from 'common/util/parseTransactionResult';

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

  private updateUser = (newUser: User) => {
    const currentUser = this.user;
    if (currentUser !== newUser) {
      this.user = newUser;
      this.userListeners.forEach(listener => listener.fn(newUser));
    }
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
    const instance = ContractDC.getInstance(ContractInstance.UserInstance);
    return await instance.getUser(account, { from: account });
  }

  // 회원 가입
  async userSignUp(userName: string, isBorrower: boolean): Promise<boolean> {
    const userAddress = ContractDC.getAccount();
    const instance = ContractDC.getInstance(ContractInstance.UserInstance);
    console.log('userName', userName);
    // 가스를 소모하지 않고 유저가 가입되어있는지 확인
    const callResult = await instance.signUpUser.call(userName, isBorrower, {
      from: userAddress,
    });
    console.log('callResult', callResult);
    if (!callResult) {
      return false;
    } else {
      // 가입 되어있지않다면 정상적인 트랜잭션을 다시 보냄
      const transactionResult = await instance.signUpUser(userName, isBorrower, {
        from: userAddress,
      });
      console.log('transactionResult', transactionResult);
      return true;
    }
  }

  async userLogIn() {
    let newUser;
    const userAddress = ContractDC.getAccount();
    const instance = ContractDC.getInstance(ContractInstance.UserInstance);
    const [userName, isBorrower, isPassKyc, isExist] = await instance.getUser(userAddress, { from: userAddress });

    if (isExist) {
      newUser = new User();
      newUser.userName = userName;
      newUser.isBorrower = isBorrower;
      newUser.isPassKyc = isPassKyc;
      newUser.userAddress = userAddress;
    } else {
      newUser = undefined;
    }
    this.updateUser(newUser);
  }

  async userAuth() {
    const instance = ContractDC.getInstance(ContractInstance.UserInstance);
    const transactionResult = await instance.authUser(ContractDC.getAccount(), {
      from: ContractDC.getAccount(),
    });
    this.user.isPassKyc = parseTransactionResult(transactionResult, ContractEvent.LogAuthUser).isPassKyc;
  }
}

export default new UserDC();
