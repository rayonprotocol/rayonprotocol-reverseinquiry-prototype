import TruffleContract from 'truffle-contract';

// agent
import ContractAgent from 'common/agent/ContractAgent';

// model
import User, { getUserResultIndex } from 'user/model/User';
import { RayonEvent } from 'common/model/RayonEvent';

class UserContractAgent extends ContractAgent {
  constructor() {
    const UserContract = TruffleContract(require('../../../build/contracts/UserDC.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogUserSignUp]);
    super(UserContract, watchEvents);
  }

  public async fetchUser(): Promise<User> {
    const userAccount = ContractAgent.getUserAccount();
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
    const userAddress = ContractAgent.getUserAccount();
    const isUser = await this._contractInstance.isUser(userAddress, {
      from: userAddress,
    });

    return isUser;
  }

  public signUp(userName: string, isBorrower: boolean): void {
    const userAddress = ContractAgent.getUserAccount();
    this._contractInstance.signUp(userName, isBorrower, {
      from: userAddress,
    });
  }
}

export default new UserContractAgent();
