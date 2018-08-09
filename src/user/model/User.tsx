export default interface User {
  isBorrower: boolean;
  userAddress: string;
  userName: string;
}

export class FinanceData {
  dataKeys: string;
  dataValues: string;

  constructor() {
    this.dataKeys = '';
    this.dataValues = '';
  }
}

/*
User request result index
*/
export enum getUserResultIndex {
  userName,
  isBorrower,
}
