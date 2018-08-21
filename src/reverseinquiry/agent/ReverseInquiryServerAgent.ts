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

class ReverseInquiryServerAgent extends ServerAgent {
  constructor() {
    const ReverseInquiryDC = TruffleContract(require('../../../build/contracts/ReverseInquiryDC.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogRegisterReverseInquiry]);
    super(ReverseInquiryDC, watchEvents);
  }

  public async fetchReverseInquiry(contentIndex: number) {
    const result: ReverseInquiryResponse = await this._contractInstance.getReverseInquiry(contentIndex, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
    const newReverseInquiry: ReverseInquiry = {
      id: result[ReverseInquiryResponseIndex.id].toNumber(),
      title: result[ReverseInquiryResponseIndex.title],
      description: result[ReverseInquiryResponseIndex.description],
      financeData: result[ReverseInquiryResponseIndex.financeData].split('%%'),
      userName: result[ReverseInquiryResponseIndex.userName],
      userAddress: result[ReverseInquiryResponseIndex.userAddress],
      timeStamp: result[ReverseInquiryResponseIndex.timeStamp],
    };
    return newReverseInquiry;
  }

  public async fetchReverseInquiries() {
    const reverseInquiriesLength: number = await this._contractInstance.getReverseInquiriesLength();
    const reverseInquiries: ReverseInquiry[] = [];
    for (let i = 0; i < reverseInquiriesLength; i++) {
      const reverseInquiry = await this.fetchReverseInquiry(i);
      reverseInquiries.push(reverseInquiry);
    }
    return reverseInquiries;
  }

  public registerReverseInquiry(title: string, content: string, tags: string[]) {
    const user = UserDC.getUser();
    if (user.userName === undefined) return false;
    const financeData = tags.join('%%');
    this._contractInstance.registerReverseInquiry(title, content, financeData, user.userName, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
  }
}

export default new ReverseInquiryServerAgent();
