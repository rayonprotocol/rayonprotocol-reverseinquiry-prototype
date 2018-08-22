import { BigNumber } from 'bignumber.js';

interface ReverseInquiry {
  id: number;
  title: string;
  description: string;
  financeData: string[];
  userName: string;
  userAddress: string;
  insertTime: number;
}

export type ReverseInquiryResponse = [BigNumber, string, string, string, string, string, number];

/*
Reverse Inquiry request result index
*/

export enum ReverseInquiryResponseIndex {
  id,
  userAddress,
  userName,
  title,
  description,
  financeData,
  insertTime,
}

export default ReverseInquiry;
