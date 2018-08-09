var strings = artifacts.require('../libraries/strings.sol');
var RayonUser = artifacts.require('./RayonUser.sol');
var Auction = artifacts.require('./Auction.sol');
var Message = artifacts.require('./Message');

module.exports = function(deployer) {
  return deployer.deploy(strings)
    .then(() => deployer.deploy(RayonUser))
    .then(rayonUser => deployer.deploy(Auction, rayonUser.address))
    .then(auction => deployer.deploy(Message, auction.address));
};
