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
      from: ReverseInquiryServerAgent.getUserAccount(),
    });
  }

  async fetchAuctionMessage(auctionId: number, messageId: number) {
    const result: AuctionMessageResponse = await this._contractInstance.getMessage(auctionId, messageId);
    const userAccount = ReverseInquiryServerAgent.getUserAccount();
    if (
      result[AuctinoMessageIndex.fromAddress] !== userAccount &&
      result[AuctinoMessageIndex.toAddress] !== userAccount
    )
      return undefined;

    const message: AuctionMessage = {
      auctionId: result[AuctinoMessageIndex.auctionId].toNumber(),
      messageId: result[AuctinoMessageIndex.messageId].toNumber(),
      fromAddress: result[AuctinoMessageIndex.fromAddress],
      toAddress: result[AuctinoMessageIndex.toAddress],
      msgType: result[AuctinoMessageIndex.msgType].toNumber(),
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

    return auctionMessages.reverse();
  }
}

export default new MessageServerAgent();
