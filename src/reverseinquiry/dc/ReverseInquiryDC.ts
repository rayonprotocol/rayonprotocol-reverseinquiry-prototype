// agent
import ReverseInquiryServerAgent from 'reverseinquiry/agent/ReverseInquiryServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogRegisterReverseInquiryArgs } from 'common/model/RayonEvent';

type ReverseInquiriesListner = (reverseInquiries: ReverseInquiry[]) => void;

class ReverseInquiryDC extends RayonDC {
  private _reverseInquiries: ReverseInquiry[];
  private _reverseInquiriesListner: Set<ReverseInquiriesListner>;

  constructor() {
    super();
    this._reverseInquiriesListner = new Set();
    ReverseInquiryServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogRegisterReverseInquiry:
        this.onRegisterReverseInquiry(event);
        break;
      default:
        break;
    }
  }

  private onRegisterReverseInquiry(event: RayonEventResponse<LogRegisterReverseInquiryArgs>) {
    if (event.args.userAddress !== this.getUserAccount()) return;
    this._eventListeners[RayonEvent.LogRegisterReverseInquiry] &&
      this._eventListeners[RayonEvent.LogRegisterReverseInquiry].forEach(listner => {
        listner(event);
      });
  }

  /*
  Reverse Inquiries handler
  */
  public addReverseInquiriesListeners(listener: ReverseInquiriesListner) {
    this._reverseInquiriesListner.add(listener);
  }

  public removeReverseInquiriesListeners(listener: ReverseInquiriesListner) {
    this._reverseInquiriesListner.delete(listener);
  }

  private onReverseInquiriesFetched(ReverseInquiries: ReverseInquiry[]) {
    this._reverseInquiriesListner && this._reverseInquiriesListner.forEach(listener => listener(ReverseInquiries));
  }

  /*
    communicate to server agent
    */

  public async fetchReverseInquiry(contentIndex: number) {
    return ReverseInquiryServerAgent.fetchReverseInquiry(contentIndex);
  }

  public async fetchReverseInquiries() {
    if (this._reverseInquiries !== undefined) {
      this.onReverseInquiriesFetched(this._reverseInquiries);
      return;
    }

    const reverseInquiriesResult = await ReverseInquiryServerAgent.fetchReverseInquiries();
    this._reverseInquiries = reverseInquiriesResult.sort((a, b) => b.id - a.id);
    console.log('this._reverseInquiries', this._reverseInquiries);
    this.onReverseInquiriesFetched(this._reverseInquiries);
  }

  public registerReverseInquiry(title: string, content: string, tags: string[]) {
    ReverseInquiryServerAgent.registerReverseInquiry(title, content, tags);
  }
}

export default new ReverseInquiryDC();
