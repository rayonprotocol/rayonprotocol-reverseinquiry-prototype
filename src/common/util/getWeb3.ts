import Web3 from 'web3';

const getWeb3 = (): Web3 => {
  let web3: Web3 = (window as any).web3 as Web3;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    const provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(provider);
  }
  return web3
};

export default getWeb3;
