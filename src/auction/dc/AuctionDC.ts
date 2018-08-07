// // agent
// import AuctionServerAgent from 'auction/agent/AuctionServerAgent';

// // model
// import Auction from 'auction/model/Auction';

// class AuctionDC {
//   private auctionContents: Auction[];

//   getAuctionContents() {
//     return this.auctionContents === undefined ? [] : this.auctionContents;
//   }

//   getAuctionContentByIndex(index: number) {
//     return this.auctionContents[index];
//   }

//   async getContentList() {
//     return AuctionServerAgent.fetchContentList();
//   }

//   async registerContent(title: string, content: string, tags: string[]) {
//     const result = await AuctionServerAgent.registerContent(title, content, tags);
//     result ? console.log('register ok') : console.log('register fail');
//   }
// }

// export default new AuctionDC();
