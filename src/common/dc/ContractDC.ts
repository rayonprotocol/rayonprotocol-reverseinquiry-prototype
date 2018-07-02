import Web3 from 'web3';

import TruffleContract from 'truffle-contract';

// util
import getWeb3 from '../util/getWeb3';

// contract
const UserContract = TruffleContract(require('../../../build/contracts/User.json'));
const AuctionContract = TruffleContract(require('../../../build/contracts/Auction.json'));
const MessageContract = TruffleContract(require('../../../build/contracts/Message.json'));

// instance index
export enum ContractInstance {
  UserInstance = 0,
  AuctionInstance,
  MessageInstance,
}

class ContractDC {
  public web3: Web3;
  public account: string;
  private instances = [];
  private contracts = [UserContract, AuctionContract, MessageContract];

  private instanceReadyListner: () => void;

  // contract deploy, migrate, initializing
  // App 시작 시 계약 배포, 초기화 진행
  public contractInit() {
    this.web3 = getWeb3();
    this.web3.eth.getAccounts((err, accounts) => {
      this.account = accounts[0];
    });
    this.deployContract();
  }

  // 등록된 모든 계약 배포
  private deployContract() {
    this.contracts.forEach(async contract => {
      contract.setProvider(this.web3.currentProvider);
      const instance = await contract.deployed();
      this.instances.push(instance);
      this.attackEvent(instance);
      this.checkContractDeployDone();
    });
  }

  // 모든 계약이 제대로 배포 되었는지 확인
  private checkContractDeployDone() {
    if (this.instanceReadyListner === undefined) return console.error('contract ready 리스너가 등록되지 않았습니다.');
    if (this.instances.length === this.contracts.length) this.instanceReadyListner();
  }

  // 계약 인스턴스에 이벤트 attach
  private attackEvent(instance) {
    const allEvents = instance.allEvents({
      fromBlock: 'latest',
      toBlock: 'latest',
    });
    allEvents.watch((err, event) => {
      this.eventListener(event);
    });
  }

  // 이벤트 발생 시 호출되는 콜백
  private eventListener(event) {
    console.log('event', event);
  }

  // common getter function
  public getInstance(index: number) {
    return this.instances[index];
  }

  public getAccount() {
    return this.account;
  }

  // common setter function
  // 시작 시 app에서 계약이 모두 배포되었는지 확인하기 위한 리스너
  public setInstanceReadyListner(listener: () => void) {
    this.instanceReadyListner = listener;
  }

  // util
  public toAscii(str: string) {
    return this.web3.toAscii(str);
  }
}

export default new ContractDC();
