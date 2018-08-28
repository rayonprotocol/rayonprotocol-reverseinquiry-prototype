import TruffleContract from 'truffle-contract';

// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import ReverseInquiry, {
  ReverseInquiryResponseIndex,
  ReverseInquiryResponse,
} from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent } from 'common/model/RayonEvent';
import Message, { MessageResponse, MessageResponseIndex } from 'reverseinquiry/model/Message';

// dc
import UserDC from 'user/dc/UserDC';
import User from 'user/model/User';

// ReverseInquiryContractAgent
class ReverseInquiryServerAgent extends ServerAgent {
  constructor() {
    const ReverseInquiryDC = TruffleContract(require('../../../build/contracts/ReverseInquiryDC.json'));
    const watchEvents: Set<RayonEvent> = new Set([
      RayonEvent.LogRegisterReverseInquiry,
      RayonEvent.LogSendReverseInquiryMessage,
    ]);
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
    console.log('reverseInquiriesLength', reverseInquiriesLength);
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

  sendMessage(
    toAddress: string,
    previousMessageId: number,
    reverseInquiryId: number,
    msgType: number,
    content: string = ''
  ) {
    this._contractInstance.sendMessage(reverseInquiryId, previousMessageId, toAddress, msgType, content, {
      from: ServerAgent.getUserAccount(),
    });
  }

  async fetchReverseInquiryMessage(reverseInquiryId: number, messageId: number): Promise<Message> {
    const result: MessageResponse = await this._contractInstance.getMessage(reverseInquiryId, messageId);
    const userAccount = ServerAgent.getUserAccount();
    if (
      result[MessageResponseIndex.fromAddress] !== userAccount &&
      result[MessageResponseIndex.toAddress] !== userAccount
    )
      return undefined;

    const message: Message = {
      reverseInquiryId: result[MessageResponseIndex.reverseInquiryId].toNumber(),
      messageId: result[MessageResponseIndex.messageId].toNumber(),
      fromAddress: result[MessageResponseIndex.fromAddress],
      toAddress: result[MessageResponseIndex.toAddress],
      msgType: result[MessageResponseIndex.msgType].toNumber(),
      content: result[MessageResponseIndex.content],
      timeStamp: result[MessageResponseIndex.timeStamp],
      isComplete: result[MessageResponseIndex.isComplete],
    };

    return message;
  }

  async fetchReverseInquiryMessages(reverseInquiryId: number): Promise<Message[]> {
    const messagesLength: number = await this._contractInstance.getMessagesLength(reverseInquiryId);
    const messages: Message[] = [];

    for (let i = 0; i < messagesLength; i++) {
      const message = await this.fetchReverseInquiryMessage(reverseInquiryId, i);
      message && messages.push(message);
    }

    return messages.reverse();
  }
}

export default new ReverseInquiryServerAgent();
