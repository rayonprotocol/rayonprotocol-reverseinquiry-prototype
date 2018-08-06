import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

let web3: Web3;
let userAccount: string;

abstract class ContractAgent {
  public static FROM_BLOCK = '0'; // event watch start block
  public static NETWORK_PORT = 7545;

  private _contract: JSON; // include ABI, contract address
  protected _contractInstance;

  constructor(contract: JSON) {
    web3 = this.setWeb3();
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
    this._contract = contract;
    this.fetchContractInstance();
  }

  /*
  Essential excuted functions
  */

  private setWeb3 = (): Web3 => {
    let web3: Web3 = (window as any).web3 as Web3;
    typeof web3 !== 'undefined'
      ? (web3 = new Web3(web3.currentProvider))
      : (web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost: ${ContractAgent.NETWORK_PORT}`)));
    return web3;
  };

  private async fetchContractInstance() {
    // Bring a ABI, Make a TruffleContract object
    const contract = TruffleContract(this._contract);
    contract.setProvider(this.getWeb3().currentProvider);

    // find rayon token instance on blockchain
    try {
      this._contractInstance = await contract.deployed();
    } catch (error) {
      console.error(error);
    }
  }

  private startEventWatch() {
    const eventRange = this.getEventRange();
    this._contractInstance.allEvents(eventRange).watch((err, event) => this.onEvent(event));
  }

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */

  // when event trigger on blockchain, this handler will occur
  private onEvent(event): void {
    console.log('event', event);
  }

  /*
  Common value getter function
  */
  public getWeb3() {
    return web3;
  }

  public getUserAccount() {
    return userAccount;
  }

  public getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
