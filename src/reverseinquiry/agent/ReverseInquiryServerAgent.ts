import TruffleContract from 'truffle-contract';

// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import ReverseInquiry, {
  ReverseInquiryResponseIndex,
  ReverseInquiryResponse,
} from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';
import User from 'user/model/User';

// ReverseInquiryContractAgent
class ReverseInquiryServerAgent extends ServerAgent {
  constructor() {
    const ReverseInquiryDC = TruffleContract(require('../../../build/contracts/ReverseInquiryDC.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogRegisterReverseInquiry]);
    super(ReverseInquiryDC, watchEvents);
  }

  public async fetchReverseInquiry(index: number): Promise<ReverseInquiry> {
    const result: ReverseInquiryResponse = await this._contractInstance.getReverseInquiry(index, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
    const newReverseInquiry: ReverseInquiry = {
      id: result[ReverseInquiryResponseIndex.id].toNumber(),
      title: result[ReverseInquiryResponseIndex.title],
      description: result[ReverseInquiryResponseIndex.description],
      financeData: result[ReverseInquiryResponseIndex.financeData].split('%%'),
      userName: result[ReverseInquiryResponseIndex.userName],
      userAddress: result[ReverseInquiryResponseIndex.userAddress],
      insertTime: result[ReverseInquiryResponseIndex.insertTime],
    };
    return newReverseInquiry;
  }

  public async fetchReverseInquiries(): Promise<ReverseInquiry[]> {
    const reverseInquiriesLength: number = await this._contractInstance.getReverseInquiriesLength();
    const reverseInquiries: ReverseInquiry[] = [];
    for (let i = 0; i < reverseInquiriesLength; i++) {
      const reverseInquiry: ReverseInquiry = await this.fetchReverseInquiry(i);
      reverseInquiries.push(reverseInquiry);
    }
    return reverseInquiries;
  }

  public registerReverseInquiry(title: string, content: string, tags: string[]): void {
    const user: User = UserDC.getUser();
    if (user === undefined || user.userName === undefined) return;
    const financeData: string = tags.join('%%');
    this._contractInstance.registerReverseInquiry(title, content, financeData, user.userName, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
  }
}

export default new ReverseInquiryServerAgent();
