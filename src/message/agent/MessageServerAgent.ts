import TruffleContract from 'truffle-contract';

// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';
import UserServerAgent from 'user/agent/UserServerAgent';

// model
import User from 'user/model/User';
import Message from 'message/model/Message';

// dc
import UserDC from 'user/dc/UserDC';

class MessageServerAgent extends ReverseInquiryServerAgent {
  constructor() {
    const MessageContract = TruffleContract(require('../../../build/contracts/Message.json'));
    super(MessageContract);
  }

  insertStartMessage(toAddress: string, auctionId: number, msgType: number, payload: string) {
    this._contractInstance.insertStartMessage(toAddress, auctionId, msgType, payload, {
      from: this.getUserAccount(),
    });
  }

  insertMessage(toAddress: string, auctionId: number, msgType: number, priviousMsgIndex: number, payload: string) {
    this._contractInstance.insertMessage(toAddress, auctionId, msgType, priviousMsgIndex, payload, {
      from: this.getUserAccount(),
    });
  }

  async fetchUserMessages() {
    const [
      msgIndexes,
      auctionIds,
      msgTypes,
      timeStamps,
      isCompletes,
      payloadsString,
    ] = await this._contractInstance.getUserMessages({
      from: this.getUserAccount(),
    });

    const [fromAddresses, toAddresses] = await this._contractInstance.getMessageAddresses({
      from: this.getUserAccount(),
    });
    // const userInstance = UserServerAgent.get;
    const user: User = UserDC.getUser();
    const payloads = payloadsString.split('||');
    const messages: Message[] = [];

    for (let i = 0; i < fromAddresses.length; i++) {
      const newMessage = new Message();

      if (fromAddresses[i] !== user.userAddress && toAddresses[i] !== user.userAddress) continue;
      newMessage.fromAddress = fromAddresses[i];
      newMessage.toAddress = toAddresses[i];

      //   newMessage.fromUserID = (await userInstance.getUser(fromAddresses[i], { from: user.userAddress }))[0];
      //   newMessage.toUserID = (await userInstance.getUser(toAddresses[i], { from: user.userAddress }))[0];

      newMessage.msgIndex = msgIndexes[i].toNumber();
      newMessage.auctionId = auctionIds[i].toNumber();
      newMessage.msgType = msgTypes[i].toNumber();
      newMessage.timeStamp = timeStamps[i].toNumber();
      newMessage.isComplete = isCompletes[i];
      newMessage.payload = payloads[i];
      messages.push(newMessage);
    }
    return messages.sort((a, b) => b.timeStamp - a.timeStamp);
  }
}

export default new MessageServerAgent();
