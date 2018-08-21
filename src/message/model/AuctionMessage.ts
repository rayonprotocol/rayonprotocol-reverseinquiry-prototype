import { BigNumber } from 'bignumber.js';

export enum MsgTypes {
  REQUEST_PERSONAL_DATA = 1,
  RESPONSE_PERSONAL_DATA,
  OFFER_PRODUCT,
  ACCEPT_OFFER,
  REJECT_OFFER,
}

const borrowerMsgTypeNames = [
  'Received Data Request',
  'Sent Data',
  'Offer Received',
  'Accepted Offer',
  'Rejected Offer',
];
const lenderMsgTypeNames = ['Requested Data', 'Received Data', 'Loan Offered', 'Accepted Offer', 'Rejected Offer'];

export namespace MsgTypes {
  export function getBorrowerMsgNames(type: MsgTypes) {
    return borrowerMsgTypeNames[type - 1];
  }
  export function getLenderMsgNames(type: MsgTypes) {
    return lenderMsgTypeNames[type - 1];
  }
}

export type AuctionMessageResponse = [BigNumber, BigNumber, string, string, BigNumber, string, number, boolean];

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
