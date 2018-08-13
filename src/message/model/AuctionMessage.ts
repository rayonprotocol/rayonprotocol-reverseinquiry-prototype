export enum MsgTypes {
  REQUEST_PERSONAL_DATA = 1,
  RESPONSE_PERSONAL_DATA,
  OFFER_PRODUCT,
  ACCEPT_OFFER,
  DENY_OFFER,
}

export type AuctionMessageResponse = [number, number, string, string, number, string, number, boolean];

interface AuctionMessage {
  auctionId: number;
  messageId: number;
  fromAddress: string;
  toAddress: string;
  msgType: MsgTypes;
  payload: string;
  timeStamp: number;
  isComplete: boolean;
}

/*
Auction message request result index
*/

export enum AuctinoMessageIndex {
  auctionId,
  messageId,
  fromAddress,
  toAddress,
  msgType,
  payload,
  timeStamp,
  isComplete,
}

export default AuctionMessage;
