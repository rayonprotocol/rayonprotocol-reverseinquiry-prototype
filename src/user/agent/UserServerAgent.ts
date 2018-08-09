import TruffleContract from 'truffle-contract';

// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

// model
import User, { getUserResultIndex } from 'user/model/User';
import { RayonEvent } from 'common/model/RayonEvent';

class UserServerAgent extends ReverseInquiryServerAgent {
  constructor() {
    const UserContract = TruffleContract(require('../../../build/contracts/User.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogAuthUser, RayonEvent.LogSignUpUser]);
    super(UserContract, watchEvents);
  }

  public async fetchUser() {
    const userAccount = this.getUserAccount();
    const result = await this._contractInstance.getUser(userAccount, {
      from: userAccount,
    });
    const newUser: User = {
      userAddress: userAccount,
      userName: result[getUserResultIndex.userName],
      isBorrower: result[getUserResultIndex.isBorrower],
    };
    return newUser;
  }

  public async isUser(): Promise<boolean> {
    await this.checkAndFetchContractInstance();
    const userAddress = this.getUserAccount();
    const isUser = await this._contractInstance.isUser(userAddress, {
      from: userAddress,
    });

    return isUser;
  }

  public signUp(userName: string, isBorrower: boolean) {
    const userAddress = this.getUserAccount();
    this._contractInstance.signUp(userName, isBorrower, {
      from: userAddress,
    });
  }
}

export default new UserServerAgent();
