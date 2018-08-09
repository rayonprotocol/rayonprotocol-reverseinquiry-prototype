// import TruffleContract from 'truffle-contract';

// // agent
// import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

// // model
// import Auction from 'auction/model/Auction';
// import { RayonEvent } from 'common/model/RayonEvent';

// // dc
// import UserDC from 'user/dc/UserDC';

// enum ContentIndex {
//   id = 0,
//   title,
//   content,
//   financeData,
//   userName,
//   userAddress,
//   timeStamp,
// }

// class AuctionServerAgent extends ReverseInquiryServerAgent {
//   constructor() {
//     const AuctionContract = TruffleContract(require('../../../build/contracts/Auction.json'));
//     const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogRegistAuctionContent]);
//     super(AuctionContract, watchEvents);
//   }

//   public async fetchContentList() {
//     const getContentResult = await this._contractInstance.getContentList({
//       from: this.getUserAccount(),
//     });
//     return this.makeContentList(getContentResult);
//   }

//   public async makeContentList(getContentResult) {
//     const contentLength = (await this._contractInstance.contentLength()).toNumber();
//     const titles = getContentResult[ContentIndex.title].split('||');
//     const contents = getContentResult[ContentIndex.content].split('||');
//     const financeDatas = getContentResult[ContentIndex.financeData].split('||');
//     const userName = getContentResult[ContentIndex.userName].split('||');

//     const auctionContents: Auction[] = [];

//     for (let i = 0; i < contentLength; i++) {
//       const newAuctionContent = new Auction();
//       newAuctionContent.id = getContentResult[ContentIndex.id][i].toNumber();
//       newAuctionContent.title = titles[i];
//       newAuctionContent.content = contents[i];
//       newAuctionContent.financeData = financeDatas[i].split('%%');
//       newAuctionContent.userName = userName[i];
//       newAuctionContent.userAddress = getContentResult[ContentIndex.userAddress][i];
//       newAuctionContent.timeStamp = getContentResult[ContentIndex.timeStamp][i].toNumber();
//       auctionContents.push(newAuctionContent);
//     }

//     return auctionContents;
//   }

//   async registerContent(title: string, content: string, tags: string[]) {
//     const user = UserDC.getUser();
//     if (user.userName === undefined) return false;
//     const userAddress = this.getUserAccount();
//     const financeData = tags.join('%%');
//     // 가스를 소모하지 않고 유저가 가입되어있는지 확인
//     const callResult = await this._contractInstance.registContent.call(
//       title,
//       content,
//       financeData,
//       user.userName,
//       userAddress,
//       {
//         from: userAddress,
//       }
//     );
//     if (!callResult) {
//       return false;
//     } else {
//       // 가입 되어있지않다면 정상적인 트랜잭션을 다시 보냄
//       await this._contractInstance.registContent(title, content, financeData, user.userName, userAddress, {
//         from: userAddress,
//       });
//       return true;
//     }
//   }
// }

// export default new AuctionServerAgent();
