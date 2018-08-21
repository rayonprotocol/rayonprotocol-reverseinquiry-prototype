import { BigNumber } from 'bignumber.js';

export interface RayonEventResponse<T> {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  type: string;
  event: string;
  args: T;
}

/*
  event
  */
export enum RayonEvent {
  LogUserSignUp = 1,
  LogRegisterReverseInquiry,
  LogSendReverseInquiryMessage,
}

const rayonEventNames = ['NONE', 'LogUserSignUp', 'LogRegisterReverseInquiry', 'LogSendReverseInquiryMessage'];

export namespace RayonEvent {
  export function getRayonEventName(eventType: number) {
    return rayonEventNames[eventType];
  }
}

/*
  Event Respond and Event Arguments interface
*/

export interface LogUserSignUpArgs {
  userAddress: string;
  userName: string;
  isBorrower: boolean;
}

export interface LogRegisterReverseInquiryArgs {
  id: BigNumber;
  title: string;
  content: string;
  financeData: string;
  userName: string;
  userAddress: string;
  timeStamp: number;
}

export interface LogSendReverseInquiryMessageArgs {
  reverseInquiryId: BigNumber;
  messageId: BigNumber;
  fromAddress: string;
  toAddress: string;
  msgType: BigNumber;
  payload: string;
  timeStamp: number;
  isComplete: boolean;
}
