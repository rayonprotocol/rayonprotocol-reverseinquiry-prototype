// agent
import MessageServerAgent from 'message/agent/MessageServerAgent';

// model
import AuctionMessage from 'message/model/AuctionMessage';
import { RayonEvent, RayonEventResponse, LogSendAuctionMessageArgs } from 'common/model/RayonEvent';

// dc
import RayonDC from 'common/dc/RayonDC';
import AuctionContent from 'auction/model/Auction';

type AuctionMessagesListner = (auctionContents: Map<number, AuctionMessage[]>) => void;

class MessageDC extends RayonDC {
  _auctionMessagesListner: Set<AuctionMessagesListner>;
  _auctionMessages: Map<number, AuctionMessage[]>;

  constructor() {
    super();
    this._auctionMessagesListner = new Set();
    this._auctionMessages = new Map();
    MessageServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogSendAuctionMessage:
        this.onAuctionMessageSent(event);
        break;
      default:
        break;
    }
  }

  private onAuctionMessageSent(event: RayonEventResponse<LogSendAuctionMessageArgs>) {
    const userAccount = this.getUserAccount();
    if (event.args.fromAddress !== userAccount || event.args.toAddress !== userAccount) return;
    this._eventListeners[RayonEvent.LogSendAuctionMessage] &&
      this._eventListeners[RayonEvent.LogSendAuctionMessage].forEach(listner => {
        listner(event);
      });
  }

  /*
  auction contents handler
  */
  public addAuctionMessagesListeners(listener: AuctionMessagesListner) {
    this._auctionMessagesListner.add(listener);
  }

  public removeAuctionMessagesListeners(listener: AuctionMessagesListner) {
    this._auctionMessagesListner.delete(listener);
  }

  private onAuctionMessagesFetched(auctionContenst: Map<number, AuctionMessage[]>) {
    this._auctionMessagesListner && this._auctionMessagesListner.forEach(listener => listener(auctionContenst));
  }

  /*
    communicate to auction
    */

  public sendMessage(
    toAddress: string,
    previousMessageId: number,
    auctionId: number,
    msgType: number,
    payload: string
  ) {
    MessageServerAgent.sendMessage(toAddress, previousMessageId, auctionId, msgType, payload);
  }

  public async fetchAuctionMessages(auctionContents: AuctionContent[]) {
    if (this._auctionMessages.size !== 0) {
      this.onAuctionMessagesFetched(this._auctionMessages);
      return;
    }
    for (let i = 0; i < auctionContents.length; i++) {
      const auctionId = auctionContents[i].id;
      this._auctionMessages[auctionId] = await MessageServerAgent.fetchAuctionMessages(auctionId);
    }

    this.onAuctionMessagesFetched(this._auctionMessages);
  }
}

export default new MessageDC();
