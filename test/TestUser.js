const [msgSender] = require('../truffle')._walletAddresses;
const User = artifacts.require('User');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'))
  .should();

contract('User', async () => {
  beforeEach(async function() {
    this.user = await User.new();
  });

  describe('valid user', function() {
    it('is user', async function() {
      await this.user.isUser(msgSender).should.eventually.be.false;
    });
  });

  describe('update and get user info', function() {
    it('sign up user', async function() {
      await this.user.signUp('alice', true);
      await this.user.isUser(msgSender).should.eventually.be.true;
    });
    it('get user', async function() {
      await this.user.signUp('alice', true);
      const expectedUserInfo = [ 'alice', true ];
      await this.user.getUser(msgSender).should.eventually.deep.equal(expectedUserInfo);
    });
    it('get user list', async function() {
      await this.user.signUp('alice', true);
      const expectedUserList = [ msgSender ];
      await this.user.getUserAddressList().should.eventually.deep.equal(expectedUserList);
    });
  });
});