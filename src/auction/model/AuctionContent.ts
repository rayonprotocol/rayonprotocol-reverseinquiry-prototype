import { BigNumber } from 'bignumber.js';

interface AuctionContent {
  id: number;
  title: string;
  content: string;
  financeData: string[];
  userName: string;
  userAddress: string;
  timeStamp: number;
}

export type AuctionContentResponse = [BigNumber, string, string, string, string, string, number];

/*
Auction content request result index
*/

export enum AuctinoContentIndex {
  id,
  title,
  content,
  financeData,
  userName,
  userAddress,
  timeStamp,
}

export default AuctionContent;
