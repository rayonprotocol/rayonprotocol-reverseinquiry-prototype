// import Message from '../model/Message';
// import groupBy from 'lodash.groupby';

// // agent
// import MessageServerAgent from 'message/agent/MessageServerAgent';

// // model
// import User from 'user/model/User';
// import Auction from 'auction/model/Auction';

// // dc
// import UserDC from 'user/dc/UserDC';
// import ContractDC, { ContractInstance } from 'common/dc/ContractDC';
// import AuctionDC from 'auction/dc/AuctionDC';

// class MessageDC {
//   _messagesGroupByAuction;
//   _messages: Message[];

//   getMessages(): Message[] {
//     return this._messages === undefined ? [] : this._messages;
//   }

//   getSortedMessageIds(): number[][][] {
//     if (this._messages === undefined) return [];
//     const msgs = this._messages;
//     const msgsByAuction = groupBy(msgs.map((msg, i) => i), msgIndex => msgs[msgIndex].auctionId);
//     const myAddr = UserDC.getUser().userAddress;
//     const result = Array.from(Object.keys(msgsByAuction))
//       .map(key => msgsByAuction[key])
//       .map(msgIndexes => {
//         const msgsByOpponent = groupBy<number>(
//           msgIndexes,
//           msgIndex => (msgs[msgIndex].fromAddress === myAddr ? msgs[msgIndex].toAddress : msgs[msgIndex].fromAddress)
//         );
//         return Array.from(Object.keys(msgsByOpponent)).map(key => msgsByOpponent[key]);
//       });
//     console.log('real result', result);
//     return result;
//   }

//   async getUserAuctionContents() {
//     const uniqueId = [...new Set(this._messages.map(item => item.auctionId))];
//     const auctionList: Auction[] = await AuctionDC.getAuctionContents();
//     const user = UserDC.getUser();

//     return user.isBorrower
//       ? auctionList.filter(item => item.userAddress === user.userAddress)
//       : auctionList.filter(item => uniqueId.indexOf(item.id) !== -1);
//   }

//   getSortedMessageByAuctionContent() {
//     if (this._messages === undefined) return [];
//     const msgs = this._messages;
//     const sorted = {};
//     msgs.forEach(item => {
//       if (sorted[item.auctionId] === undefined) return (sorted[item.auctionId] = item);
//       if (sorted[item.auctionId].timeStamp < item.timeStamp) return (sorted[item.auctionId] = item);
//     });
//     return sorted;
//   }

//   async getUserMessages() {
//     this._messages = await MessageServerAgent.fetchUserMessages();
//     return this._messages;
//   }

//   getUserMessagesByAuctionId(auctionId: number): Message[] {
//     if (this._messages === undefined) return [];
//     return this._messages.filter(message => {
//       if (auctionId === message.auctionId) return message;
//     });
//   }

//   async insertStartMessage(toAddress: string, auctionId: number, msgType: number, payload: string) {
//     MessageServerAgent.insertStartMessage(toAddress, auctionId, msgType, payload);
//   }

//   async insertMessage(
//     toAddress: string,
//     auctionId: number,
//     msgType: number,
//     priviousMsgIndex: number,
//     payload: string
//   ) {
//     MessageServerAgent.insertMessage(toAddress, auctionId, msgType, priviousMsgIndex, payload);
//   }
// }

// export default new MessageDC();
