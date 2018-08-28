import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

// event
import { RayonEvent } from 'common/model/RayonEvent';

let web3: Web3;
let userAccount: string;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);
type ContractDeployListner = () => void;

abstract class ContractAgent {
  public static FROM_BLOCK: string = 'latest'; // event watch start block
  public static NETWORK_PORT: number = 7545;

  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;

  private _contract: JSON; // include ABI, contract address
  protected _contractInstance;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.setWeb3();
    this.setUserAccount();
    this.fetchContractInstance();
  }

  private setUserAccount(): void {
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
  }

  private setWeb3(): void {
    let browserWeb3: Web3 = (window as any).web3 as Web3;
    typeof browserWeb3 !== 'undefined'
      ? (browserWeb3 = new Web3(browserWeb3.currentProvider))
      : (browserWeb3 = new Web3(new Web3.providers.HttpProvider(`http://localhost: ${ContractAgent.NETWORK_PORT}`)));
    web3 = browserWeb3;
  }

  private async fetchContractInstance() {
    // Bring a ABI, Make a TruffleContract object
    const contract = TruffleContract(this._contract);
    contract.setProvider(ContractAgent.getWeb3().currentProvider);

    // find rayon token instance on blockchain
    try {
      this._contractInstance = await contract.deployed();
    } catch (error) {
      console.error(error);
    }
    this.startEventWatch();
  }

  private startEventWatch() {
    if (this._watchEvents === undefined) return;
    if (this._contractInstance === undefined) {
      console.error(`contract Instance is undefined, please check network port ${ContractAgent.NETWORK_PORT}`);
      return;
    }

    const eventRange = ContractAgent.getEventRange();

    this._watchEvents.forEach(eventType => {
      const targetEventFunction = this._contractInstance[RayonEvent.getRayonEventName(eventType)]({}, eventRange);
      targetEventFunction.watch(this.onEvent.bind(this, eventType));
    });
  }

  // prevent call a undefined contract instance by data conroller
  // check contract instance is undefined and refetch
  protected async checkAndFetchContractInstance() {
    !this._contractInstance && (await this.fetchContractInstance());
  }

  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  private onEvent(eventType: RayonEvent, error, event): void {
    console.log('event', event);
    if (error) console.error(error);
    this._eventListener && this._eventListener(eventType, event);
  }

  public static getWeb3() {
    return web3;
  }

  public static getUserAccount() {
    return userAccount;
  }

  public static getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
