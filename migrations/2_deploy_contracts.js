var strings = artifacts.require('../libraries/strings.sol');
var UserDC = artifacts.require('./UserDC.sol');
var ReverseInquiryDC = artifacts.require('./ReverseInquiryDC.sol');

module.exports = function(deployer) {
  return deployer
    .deploy(strings)
    .then(() => deployer.deploy(UserDC))
    .then(userDC => deployer.deploy(ReverseInquiryDC, userDC.address));
};
