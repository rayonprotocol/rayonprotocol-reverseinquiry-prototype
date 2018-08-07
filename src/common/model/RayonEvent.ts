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
    LogAuthUser,
  }
  
  const rayonEventNames = ['NONE', 'LogSignUpUser', 'LogAuthUser'];
  
  export namespace RayonEvent {
    export function getRayonEventName(eventType: number) {
      return rayonEventNames[eventType];
    }
  }
  
  /*
    Event Respond and Event Arguments interface
    */
  
  export interface LogSignUpUserEvent {
    userAddress: string;
    userName: string;
    isBorrower: boolean;
  }
  
  export interface LogAuthUserEvent {
    isPassKyc: boolean;
  }
  