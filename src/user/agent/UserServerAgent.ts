import TruffleContract from 'truffle-contract';

// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

// model
import User from 'user/model/User';
import { ContractEvent } from 'common/model/CommonModel';

// util
import parseTransactionResult from 'common/util/parseTransactionResult';

class UserServerAgent extends ReverseInquiryServerAgent {
  constructor() {
    const UserContract = TruffleContract(require('../../../build/contracts/User.json'));
    super(UserContract);
  }
  async fetchUser(account: string) {
    return await this._contractInstance.getUser(account, { from: account });
  }

  async userSignUp(userName: string, isBorrower: boolean): Promise<boolean> {
    const userAddress = this.getUserAccount();
    // 가스를 소모하지 않고 유저가 가입되어있는지 확인
    const callResult = await this._contractInstance.signUpUser.call(userName, isBorrower, {
      from: userAddress,
    });
    if (!callResult) {
      return false;
    } else {
      // 가입 되어있지않다면 정상적인 트랜잭션을 다시 보냄
      const transactionResult = await this._contractInstance.signUpUser(userName, isBorrower, {
        from: userAddress,
      });
      return true;
    }
  }

  async userLogIn() {
    let newUser;
    const userAddress = this.getUserAccount();
    const [userName, isBorrower, isPassKyc, isExist] = await this._contractInstance.getUser(userAddress, {
      from: userAddress,
    });

    if (isExist) {
      newUser = new User();
      newUser.userName = userName;
      newUser.isBorrower = isBorrower;
      newUser.isPassKyc = isPassKyc;
      newUser.userAddress = userAddress;
    } else {
      newUser = undefined;
    }
    return newUser;
  }

  async userAuth() {
    const transactionResult = await this._contractInstance.authUser(this.getUserAccount(), {
      from: this.getUserAccount(),
    });
    return parseTransactionResult(transactionResult, ContractEvent.LogAuthUser).isPassKyc;
  }
}

export default new UserServerAgent();
