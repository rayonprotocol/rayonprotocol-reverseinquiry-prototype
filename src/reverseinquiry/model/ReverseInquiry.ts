import { BigNumber } from 'bignumber.js';

interface ReverseInquiry {
  id: number;
  title: string;
  content: string;
  financeData: string[];
  userName: string;
  userAddress: string;
  timeStamp: number;
}

export type ReverseInquiryResponse = [BigNumber, string, string, string, string, string, number];

/*
Reverse Inquiry request result index
*/

export enum ReverseInquiryResponseIndex {
  id,
  title,
  content,
  financeData,
  userName,
  userAddress,
  timeStamp,
}

export default ReverseInquiry;
