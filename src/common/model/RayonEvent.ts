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
  LogSignUpUser = 1,
  LogRegisterAuctionContent,
  LogSendAuctionMessage,
}

const rayonEventNames = ['NONE', 'LogSignUpUser', 'LogRegisterAuctionContent', 'LogSendAuctionMessage'];

export namespace RayonEvent {
  export function getRayonEventName(eventType: number) {
    return rayonEventNames[eventType];
  }
}

/*
  Event Respond and Event Arguments interface
*/

export interface LogSignUpEventArgs {
  userAddress: string;
  userName: string;
  isBorrower: boolean;
}

export interface LogRegisterAuctionContentArgs {
  id: BigNumber;
  title: string;
  content: string;
  financeData: string;
  userName: string;
  userAddress: string;
  timeStamp: number;
}

export interface LogSendAuctionMessageArgs {
  auctionId: BigNumber;
  messageId: BigNumber;
  fromAddress: string;
  toAddress: string;
  msgType: BigNumber;
  payload: string;
  timeStamp: number;
  isComplete: boolean;
}
