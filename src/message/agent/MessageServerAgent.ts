import TruffleContract from 'truffle-contract';

// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import Message, { MessageResponse, MessageResponseIndex } from 'message/model/Message';
import { RayonEvent } from 'common/model/RayonEvent';

class MessageServerAgent extends ServerAgent {
  constructor() {
    const ReverseInquiryMessageDC = TruffleContract(require('../../../build/contracts/ReverseInquiryMessageDC.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogSendReverseInquiryMessage]);
    super(ReverseInquiryMessageDC, watchEvents);
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

export default new MessageServerAgent();
