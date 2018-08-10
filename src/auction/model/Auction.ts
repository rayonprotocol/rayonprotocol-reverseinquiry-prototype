interface AuctionContent {
  id: number;
  title: string;
  content: string;
  financeData: string[];
  userName: string;
  userAddress: string;
  timeStamp: number;
}

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
