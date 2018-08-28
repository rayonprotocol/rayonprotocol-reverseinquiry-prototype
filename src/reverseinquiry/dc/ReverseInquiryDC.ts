// agent
import ReverseInquiryServerAgent from 'reverseinquiry/agent/ReverseInquiryServerAgent';

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

  private _messages: Map<number, Message[]>;
  private _messagesListner: Set<MessagesListner>;

  constructor() {
    super();
    this._reverseInquiriesListner = new Set();
    this._messagesListner = new Set();
    this._messages = new Map<number, Message[]>();
    this._reverseInquiries = new Array<ReverseInquiry>();
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

  public addMessagesListeners(listener: MessagesListner): void {
    this._messagesListner.add(listener);
  }

  public removeMessagesListeners(listener: MessagesListner): void {
    this._messagesListner.delete(listener);
  }

  private onMessagesFetched(messages: Map<number, Message[]>): void {
    this._messagesListner && this._messagesListner.forEach(listener => listener(messages));
  }

  /*
    communicate to server agent
    */

  public async fetchReverseInquiry(contentIndex: number): Promise<ReverseInquiry> {
    return ReverseInquiryServerAgent.fetchReverseInquiry(contentIndex);
  }

  public async fetchReverseInquiries(): Promise<void> {
    if (!ArrayUtil.isEmpty(this._reverseInquiries)) {
      this.onReverseInquiriesFetched(this._reverseInquiries);
      return;
    }

    const reverseInquiriesResult = await ReverseInquiryServerAgent.fetchReverseInquiries();
    this._reverseInquiries = reverseInquiriesResult.sort((a, b) => b.id - a.id);
    this.onReverseInquiriesFetched(this._reverseInquiries);
  }

  public registerReverseInquiry(title: string, content: string, tags: string[]): void {
    ReverseInquiryServerAgent.registerReverseInquiry(title, content, tags);
  }

  public sendMessage(
    toAddress: string,
    previousMessageId: number,
    reverseInquiryId: number,
    msgType: number,
    content?: string
  ): void {
    ReverseInquiryServerAgent.sendMessage(toAddress, previousMessageId, reverseInquiryId, msgType, content);
  }

  public async fetchMessages(reverseInquiries: ReverseInquiry[]): Promise<void> {
    if (this._messages.size !== 0) {
      this.onMessagesFetched(this._messages);
      return;
    }
    if (reverseInquiries === undefined) console.error('reverseInquiry is undefined');

    for (let i = 0; i < reverseInquiries.length; i++) {
      const reverseInquiryId = reverseInquiries[i].id;
      this._messages[reverseInquiryId] = await ReverseInquiryServerAgent.fetchReverseInquiryMessages(reverseInquiryId);
    }

    this.onMessagesFetched(this._messages);
  }
}

export default new ReverseInquiryDC();
