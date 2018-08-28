// agent
import MessageServerAgent from 'message/agent/MessageServerAgent';

// model
import Message from 'message/model/Message';
import { RayonEvent, RayonEventResponse, LogSendReverseInquiryMessageArgs } from 'common/model/RayonEvent';

// dc
import RayonEventDC from 'common/dc/RayonEventDC';
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';

type MessagesListner = (reverseInquiries: Map<number, Message[]>) => void;

//REVIEW: ContractMessageDC
class MessageDC extends RayonEventDC {
  _messagesListner: Set<MessagesListner>;
  _messages: Map<number, Message[]>;

  constructor() {
    super();
    this._messagesListner = new Set();
    this._messages = new Map();
    MessageServerAgent.setEventListner(this.onEvent.bind(this));
  }

  /*
  event handler
  */
  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.LogSendReverseInquiryMessage:
        this.onReverseInquiryMessageSent(event);
        break;
      default:
        break;
    }
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
  auction contents handler
  */
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
    communicate to auction
  */
  public sendMessage(
    toAddress: string,
    previousMessageId: number,
    reverseInquiryId: number,
    msgType: number,
    content?: string
  ): void {
    MessageServerAgent.sendMessage(toAddress, previousMessageId, reverseInquiryId, msgType, content);
  }

  public async fetchMessages(reverseInquiries: ReverseInquiry[]): Promise<void> {
    if (this._messages.size !== 0) {
      this.onMessagesFetched(this._messages);
      return;
    }
    if (reverseInquiries === undefined) console.error('reverseInquiry is undefined');

    for (let i = 0; i < reverseInquiries.length; i++) {
      const reverseInquiryId = reverseInquiries[i].id;
      this._messages[reverseInquiryId] = await MessageServerAgent.fetchReverseInquiryMessages(reverseInquiryId);
    }

    this.onMessagesFetched(this._messages);
  }
}

export default new MessageDC();
