interface User {
  isBorrower: boolean;
  userAddress: string;
  userName: string;
}

export interface FinanceData {
  dataKeys: string;
  dataValues: string;
}

export enum UserType {
  ENTITY_LENDER,
  ENTITY_BORROWER,
}

const UserTypeNames = ['Lender', 'Borrower'];

export namespace UserType {
  export function getUserTypeNames(type: UserType) {
    return UserTypeNames[type];
  }
}

/*
User request result index
*/
export enum getUserResultIndex {
  userName,
  isBorrower,
}

export default User;
