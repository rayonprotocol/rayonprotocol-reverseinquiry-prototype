export enum MsgTypes {
  REQUEST_PERSONAL_DATA = 1,
  RESPONSE_PERSONAL_DATA,
  OFFER_PRODUCT,
  ACCEPT_OFFER,
  DENY_OFFER,
}

class Message {
  fromAddress: string;
  toAddress: string;
  auctionId: number;
  msgType: MsgTypes;
  timeStamp: number;
  payload: string;
}

export default Message;
