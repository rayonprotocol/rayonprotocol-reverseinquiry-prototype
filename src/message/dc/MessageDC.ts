import Message from '../model/Message';
import groupBy from 'lodash.groupby';

// model
import User from 'user/model/User';

// dc
import UserDC from 'user/dc/UserDC';
import ContractDC, { ContractInstance } from 'common/dc/ContractDC';
import { version } from 'react-dom';

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
    return this.makeContentList();
  }

  getUserMessagesByAuctionId(auctionId: number): Message[] {
    if (this._messages === undefined) return [];
    return this._messages.filter(message => {
      if (auctionId === message.auctionId) return message;
    });
  }

  async makeContentList() {
    const instance = ContractDC.getInstance(ContractInstance.MessageInstance);
    const [msgIndexes, auctionIds, msgTypes, timeStamps, isCompletes, payloadsString] = await instance.getUserMessages({
      from: ContractDC.getAccount(),
    });

    const [fromAddresses, toAddresses] = await instance.getMessageAddresses({
      from: ContractDC.getAccount(),
    });
    const userInstance = ContractDC.getInstance(ContractInstance.UserInstance);
    const user: User = UserDC.getUser();
    const payloads = payloadsString.split('||');
    const messages: Message[] = [];

    for (let i = 0; i < fromAddresses.length; i++) {
      const newMessage = new Message();

      if (fromAddresses[i] !== user.userAddress && toAddresses[i] !== user.userAddress) continue;
      newMessage.fromAddress = fromAddresses[i];
      newMessage.toAddress = toAddresses[i];

      newMessage.fromUserID = (await userInstance.getUser(fromAddresses[i], { from: user.userAddress }))[0];
      newMessage.toUserID = (await userInstance.getUser(toAddresses[i], { from: user.userAddress }))[0];

      newMessage.msgIndex = msgIndexes[i].toNumber();
      newMessage.auctionId = auctionIds[i].toNumber();
      newMessage.msgType = msgTypes[i].toNumber();
      newMessage.timeStamp = timeStamps[i].toNumber();
      newMessage.isComplete = isCompletes[i];
      newMessage.payload = payloads[i];
      messages.push(newMessage);
    }
    console.log('Messages', messages);
    this._messages = messages.sort((a, b) => b.timeStamp - a.timeStamp);
    return this._messages;
  }

  async insertStartMessage(toAddress: string, auctionId: number, msgType: number, payload: string) {
    const instance = ContractDC.getInstance(ContractInstance.MessageInstance);
    const insertMessageResult = await instance.insertStartMessage(toAddress, auctionId, msgType, payload, {
      from: ContractDC.getAccount(),
    });
  }

  async insertMessage(
    toAddress: string,
    auctionId: number,
    msgType: number,
    priviousMsgIndex: number,
    payload: string
  ) {
    const instance = ContractDC.getInstance(ContractInstance.MessageInstance);
    const insertMessageResult = await instance.insertMessage(toAddress, auctionId, msgType, priviousMsgIndex, payload, {
      from: ContractDC.getAccount(),
    });
  }
}

export default new MessageDC();
