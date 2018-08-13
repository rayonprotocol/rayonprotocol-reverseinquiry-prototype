import TruffleContract from 'truffle-contract';

// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

// model
import AuctionContent, { AuctinoContentIndex, AuctionContentResponse } from 'auction/model/AuctionContent';
import { RayonEvent } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';

class AuctionServerAgent extends ReverseInquiryServerAgent {
  constructor() {
    const AuctionContract = TruffleContract(require('../../../build/contracts/RayonAuction.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogRegisterAuctionContent]);
    super(AuctionContract, watchEvents);
  }

  public async fetchAuctionContent(contentIndex: number) {
    const result: AuctionContentResponse = await this._contractInstance.getContent(contentIndex, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
    const content: AuctionContent = {
      id: result[AuctinoContentIndex.id].toNumber(),
      title: result[AuctinoContentIndex.title],
      content: result[AuctinoContentIndex.content],
      financeData: result[AuctinoContentIndex.financeData].split('%%'),
      userName: result[AuctinoContentIndex.userName],
      userAddress: result[AuctinoContentIndex.userAddress],
      timeStamp: result[AuctinoContentIndex.timeStamp],
    };
    return content;
  }

  public async fetchAuctionContents() {
    const auctionContentLength: number = await this._contractInstance.getContentsLength();
    const auctionContents: AuctionContent[] = [];
    for (let i = 0; i < auctionContentLength; i++) {
      const auctionContent = await this.fetchAuctionContent(i);
      auctionContents.push(auctionContent);
    }
    return auctionContents;
  }

  public registerAuctionContent(title: string, content: string, tags: string[]) {
    const user = UserDC.getUser();
    if (user.userName === undefined) return false;
    const financeData = tags.join('%%');
    this._contractInstance.registerAuctionContent(title, content, financeData, user.userName, {
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
  }
}

export default new AuctionServerAgent();
