var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'rhythm vicious awful truck hint boring scale debris embark forest decline salad'; // 12 word mnemonic
var devProvider = new HDWalletProvider(mnemonic, 'http://localhost:8545');

module.exports = {
  networks: {
    development: {
      gas: 90000000000,
      gasPrice: 1,
      provider: devProvider,
      network_id: '*', // Match any network id
    },
  },
  _walletAddresses: devProvider.addresses, // custom property for dev
};
