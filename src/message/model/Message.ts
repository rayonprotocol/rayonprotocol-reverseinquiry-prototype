import { BigNumber } from 'bignumber.js';

export type FinanceProduct = [string, string, string];

export enum FinanceProductType {
  amount,
  interest,
  maturity,
}

const financeProductNames = ['Amount', 'Interest', 'Maturity'];

export namespace FinanceProductType {
  export function getFinanceProductNames(type: FinanceProductType) {
    return financeProductNames[type];
  }
}

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

export type MessageResponse = [BigNumber, BigNumber, string, string, BigNumber, string, number, boolean];

interface Message {
  reverseInquiryId: number;
  messageId: number;
  fromAddress: string;
  toAddress: string;
  msgType: MsgTypes;
  content: string;
  timeStamp: number;
  isComplete: boolean;
}

/*
Auction message request result index
*/

export enum MessageResponseIndex {
  reverseInquiryId,
  messageId,
  fromAddress,
  toAddress,
  msgType,
  content,
  timeStamp,
  isComplete,
}

export default Message;
