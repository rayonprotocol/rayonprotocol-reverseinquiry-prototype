import TruffleContract from 'truffle-contract';

// agent
import ReverseInquiryServerAgent from 'common/agent/ReverseInquiryServerAgent';

// model
import AuctionMessage, { AuctionMessageResponse, AuctinoMessageIndex } from 'message/model/AuctionMessage';
import { RayonEvent } from 'common/model/RayonEvent';

class MessageServerAgent extends ReverseInquiryServerAgent {
  constructor() {
    const RayonAuctionMessage = TruffleContract(require('../../../build/contracts/RayonAuctionMessage.json'));
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.LogSendAuctionMessage]);
    super(RayonAuctionMessage, watchEvents);
  }

  sendMessage(toAddress: string, previousMessageId: number, auctionId: number, msgType: number, payload: string) {
    this._contractInstance.sendMessage(auctionId, previousMessageId, toAddress, msgType, payload, {
      from: this.getUserAccount(),
    });
  }

  async fetchAuctionMessage(auctionId: number, messageId: number) {
    const result: AuctionMessageResponse = await this._contractInstance.getMessage(auctionId, messageId);
    const userAccount = this.getUserAccount();
    if (
      result[AuctinoMessageIndex.fromAddress] !== userAccount &&
      result[AuctinoMessageIndex.toAddress] !== userAccount
    )
      return undefined;

    const message: AuctionMessage = {
      auctionId: result[AuctinoMessageIndex.auctionId],
      messageId: result[AuctinoMessageIndex.messageId],
      fromAddress: result[AuctinoMessageIndex.fromAddress],
      toAddress: result[AuctinoMessageIndex.toAddress],
      msgType: result[AuctinoMessageIndex.msgType],
      payload: result[AuctinoMessageIndex.payload],
      timeStamp: result[AuctinoMessageIndex.timeStamp],
      isComplete: result[AuctinoMessageIndex.isComplete],
    };

    return message;
  }

  async fetchAuctionMessages(auctionId: number) {
    const auctionMessageLength: number = await this._contractInstance.getMessagesLength(auctionId);
    const auctionMessages: AuctionMessage[] = [];

    for (let i = 0; i < auctionMessageLength; i++) {
      const auctionMessage = await this.fetchAuctionMessage(auctionId, i);
      auctionMessage && auctionMessages.push(auctionMessage);
    }

    return auctionMessages;
  }
}

export default new MessageServerAgent();
