// // agent
// import AuctionServerAgent from 'auction/agent/AuctionServerAgent';

// // dc
// import RayonDC from 'common/dc/RayonDC';

// // model
// import Auction from 'auction/model/Auction';

// class AuctionDC extends RayonDC {
//   private auctionContents: Auction[];

//   fetchAuctionContents() {
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
