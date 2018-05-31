import Message from '../model/Message';
// import sortBy from 'lodash.sortby';
import groupBy from 'lodash.groupby';

// dc
import UserDC from 'user/dc/UserDC';
import ContractDC, { ContractInstance } from 'common/dc/ContractDC';

class MessageDC {
  _messages: Message[];

  getMessages(): Message[] {
    return this._messages === undefined ? [] : this._messages;
  }

  getSortedMessageIds(): number[][][] {
    if (this._messages === undefined) return [];
    const msgs = this._messages;
    const msgsByAuction = groupBy(msgs.map((msg, i) => i), msgIndex => msgs[msgIndex].auctionId);
    const myAddr = UserDC.getUser().userAddress;
    const result = Array.from(Object.keys(msgsByAuction))
      .map(key => msgsByAuction[key])
      .map(msgIndexes => {
        const msgsByOpponent = groupBy<number>(
          msgIndexes,
          msgIndex => (msgs[msgIndex].fromAddress === myAddr ? msgs[msgIndex].toAddress : msgs[msgIndex].fromAddress)
        );
        return Array.from(Object.keys(msgsByOpponent)).map(key => msgsByOpponent[key]);
      });
    console.log('real result', result);
    return result;
  }

  /*
    {
      auctionId: latestAuctionContent,
      auctionId: latestAuctionContent,
    }
  */
  getSortedMessageByAuctionContent() {
    if (this._messages === undefined) return [];
    const msgs = this._messages;
    const sorted = {};
    msgs.forEach(item => {
      if (sorted[item.auctionId] === undefined) return (sorted[item.auctionId] = item);
      if (sorted[item.auctionId].timeStamp < item.timeStamp) return (sorted[item.auctionId] = item);
    });
    return sorted;
  }

  async getUserMessages() {
    const instance = ContractDC.getInstance(ContractInstance.MessageInstance);
    const getContentResult = await instance.getUserMessages({
      from: ContractDC.getAccount(),
    });
    return this.makeContentList(getContentResult, instance);
  }

  getUserMessagesByAuctionId(auctionId: number): Message[] {
    if (this._messages === undefined) return [];
    return this._messages.filter(message => {
      if (auctionId === message.auctionId) return message;
    });
  }

  async makeContentList(getContentResult, instance) {
    const [fromAddresses, toAddresses, auctionIds, msgTypes, timeStamps, payloadsString] = getContentResult;
    console.log(getContentResult);
    const payloads = payloadsString.split('||');
    const messageLength = fromAddresses.length;
    const messages: Message[] = [];

    for (let i = 0; i < messageLength; i++) {
      const newMessage = new Message();
      newMessage.fromAddress = fromAddresses[i];
      newMessage.toAddress = toAddresses[i];
      newMessage.auctionId = auctionIds[i].toNumber();
      newMessage.msgType = msgTypes[i].toNumber();
      newMessage.timeStamp = timeStamps[i].toNumber();
      newMessage.payload = payloads[i];
      messages.push(newMessage);
    }
    console.log('Messages', messages);
    this._messages = messages.sort((a, b) => b.timeStamp - a.timeStamp);
    return this._messages;
  }

  async insertMessage(toAddress: string, auctionId: number, msgType: number, payload: string) {
    const instance = ContractDC.getInstance(ContractInstance.MessageInstance);
    const insertMessageResult = await instance.insertMessage(toAddress, auctionId, msgType, payload, {
      from: ContractDC.getAccount(),
    });
    console.log('insertMessageResult', insertMessageResult);
  }
}

export default new MessageDC();
