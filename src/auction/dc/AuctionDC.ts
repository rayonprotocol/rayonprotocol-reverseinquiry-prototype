// agent
import AuctionServerAgent from 'auction/agent/AuctionServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import AuctionContent from 'auction/model/Auction';
import { RayonEvent, RayonEventResponse, LogRegisterAuctionContentArgs } from 'common/model/RayonEvent';

type AuctionContentsListner = (auctionContents: AuctionContent[]) => void;

class AuctionDC extends RayonDC {
  private _auctionContents: AuctionContent[];

  private _auctionContentsListner: Set<AuctionContentsListner>;

  constructor() {
    super();
    this._auctionContentsListner = new Set();
    AuctionServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogRegisterAuctionContent:
        this.onRegisterAuctionContent(event);
        break;
      default:
        break;
    }
  }

  private onRegisterAuctionContent(event: RayonEventResponse<LogRegisterAuctionContentArgs>) {
    if (event.args.userAddress !== AuctionServerAgent.getUserAccount()) return;
    this._eventListeners[RayonEvent.LogRegisterAuctionContent] &&
      this._eventListeners[RayonEvent.LogRegisterAuctionContent].forEach(listner => {
        listner(event);
      });
  }

  /*
  user handler
  */
  public addAuctionContentsListeners(listener: AuctionContentsListner) {
    this._auctionContentsListner.add(listener);
  }

  public removeAuctionContentsListeners(listener: AuctionContentsListner) {
    this._auctionContentsListner.delete(listener);
  }

  private onAuctionContentFetched(auctionContenst: AuctionContent[]) {
    this._auctionContentsListner && this._auctionContentsListner.forEach(listener => listener(auctionContenst));
  }

  /*
    communicate to auction
    */

  public async fetchAuctionContent(contentIndex: number) {
    return AuctionServerAgent.fetchAuctionContent(contentIndex);
  }

  public async fetchAuctionContents() {
    if (this._auctionContents !== undefined) {
      this.onAuctionContentFetched(this._auctionContents);
      return;
    }
    const auctionContents = await AuctionServerAgent.fetchAuctionContents();
    this.onAuctionContentFetched(auctionContents);
  }

  public registerAuctionContent(title: string, content: string, tags: string[]) {
    AuctionServerAgent.registerAuctionContent(title, content, tags);
  }
}

export default new AuctionDC();
