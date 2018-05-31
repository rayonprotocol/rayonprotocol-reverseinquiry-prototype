var strings = artifacts.require('../libraries/strings.sol');
var User = artifacts.require('./User.sol');
var Auction = artifacts.require('./Auction.sol');
var Message = artifacts.require('./Message');

module.exports = function(deployer) {
  return deployer.deploy(strings)
    .then(() => deployer.deploy(User))
    .then(user => deployer.deploy(Auction, user.address))
    .then(auction => deployer.deploy(Message, auction.address));
};
