export default class User {
  isPassKyc: boolean;
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