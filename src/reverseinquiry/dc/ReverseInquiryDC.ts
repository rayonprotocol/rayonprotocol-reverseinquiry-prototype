// agent
import ReverseInquiryContractAgent from 'reverseinquiry/agent/ReverseInquiryContractAgent';

// model
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import {
  RayonEvent,
  RayonEventResponse,
  LogRegisterReverseInquiryArgs,
  LogSendReverseInquiryMessageArgs,
} from 'common/model/RayonEvent';
import Message from 'reverseinquiry/model/Message';

// dc
import RayonEventDC from 'common/dc/RayonEventDC';

// util
import ArrayUtil from 'common/util/ArrayUtil';

type ReverseInquiriesListner = (reverseInquiries: ReverseInquiry[]) => void;
type MessagesListner = (reverseInquiries: Map<number, Message[]>) => void;

class ReverseInquiryDC extends RayonEventDC {
  private _reverseInquiries: ReverseInquiry[];
  private _reverseInquiriesListner: Set<ReverseInquiriesListner>;

  constructor() {
    super();
    this._reverseInquiriesListner = new Set();
    this._reverseInquiries = new Array<ReverseInquiry>();
    ReverseInquiryContractAgent.setEventListner(this.onEvent.bind(this));
  }

  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogRegisterReverseInquiry:
        this.onRegisterReverseInquiry(event);
        break;
      case RayonEvent.LogSendReverseInquiryMessage:
        this.onReverseInquiryMessageSent(event);
        break;
      default:
        break;
    }
  }

  private onRegisterReverseInquiry(event: RayonEventResponse<LogRegisterReverseInquiryArgs>): void {
    if (event.args.userAddress !== this.getUserAccount()) return;
    this._eventListeners[RayonEvent.LogRegisterReverseInquiry] &&
      this._eventListeners[RayonEvent.LogRegisterReverseInquiry].forEach(listner => {
        listner(event);
      });
  }

  private onReverseInquiryMessageSent(event: RayonEventResponse<LogSendReverseInquiryMessageArgs>): void {
    const userAccount = this.getUserAccount();
    if (event.args.fromAddress !== userAccount && event.args.toAddress !== userAccount) return;
    this._eventListeners[RayonEvent.LogSendReverseInquiryMessage] &&
      this._eventListeners[RayonEvent.LogSendReverseInquiryMessage].forEach(listner => {
        listner(event);
      });
  }

  /*
  Reverse Inquiries handler
  */
  public addReverseInquiriesListeners(listener: ReverseInquiriesListner): void {
    this._reverseInquiriesListner.add(listener);
  }

  public removeReverseInquiriesListeners(listener: ReverseInquiriesListner): void {
    this._reverseInquiriesListner.delete(listener);
  }

  private onReverseInquiriesFetched(ReverseInquiries: ReverseInquiry[]): void {
    this._reverseInquiriesListner && this._reverseInquiriesListner.forEach(listener => listener(ReverseInquiries));
  }
  /*
    communicate to server agent
    */

  public async fetchReverseInquiry(contentIndex: number): Promise<ReverseInquiry> {
    return ReverseInquiryContractAgent.fetchReverseInquiry(contentIndex);
  }

  public async fetchReverseInquiries(): Promise<void> {
    if (!ArrayUtil.isEmpty(this._reverseInquiries)) {
      this.onReverseInquiriesFetched(this._reverseInquiries);
      return;
    }

    const reverseInquiriesResult = await ReverseInquiryContractAgent.fetchReverseInquiries();
    this._reverseInquiries = reverseInquiriesResult.sort((a, b) => b.id - a.id);
    this.onReverseInquiriesFetched(this._reverseInquiries);
  }

  public registerReverseInquiry(title: string, content: string, tags: string[]): void {
    ReverseInquiryContractAgent.registerReverseInquiry(title, content, tags);
  }

  public sendMessage(
    toAddress: string,
    previousMessageId: number,
    reverseInquiryId: number,
    msgType: number,
    content?: string
  ): void {
    ReverseInquiryContractAgent.sendMessage(toAddress, previousMessageId, reverseInquiryId, msgType, content);
  }
}

export default new ReverseInquiryDC();
