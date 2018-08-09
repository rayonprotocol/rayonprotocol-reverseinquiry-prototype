const [msgSender] = require('../truffle')._walletAddresses;
const RayonUser = artifacts.require('RayonUser');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'))
  .should();

contract('RayonUser', async () => {
  beforeEach(async function() {
    this.rayonUser = await RayonUser.new();
  });

  describe('valid user', function() {
    it('is user', async function() {
      await this.rayonUser.isUser(msgSender).should.eventually.be.false;
    });
  });

  describe('update and get user info', function() {
    it('sign up user', async function() {
      await this.rayonUser.signUp('alice', true);
      await this.rayonUser.isUser(msgSender).should.eventually.be.true;
    });
    it('get user', async function() {
      await this.rayonUser.signUp('alice', true);
      const expectedUserInfo = [ 'alice', true ];
      await this.rayonUser.getUser(msgSender).should.eventually.deep.equal(expectedUserInfo);
    });
    it('get user list', async function() {
      await this.rayonUser.signUp('alice', true);
      const expectedUserList = [ msgSender ];
      await this.rayonUser.getUserAddressList().should.eventually.deep.equal(expectedUserList);
    });
  });
});