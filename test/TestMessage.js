const [msgSender] = require('../truffle')._walletAddresses;
const RayonAuction = artifacts.require('RayonAuction');
const RayonAuctionMessage = artifacts.require('RayonAuctionMessage');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'))
  .should();

contract('RayonMessage', async () => {
  beforeEach(async function() {
    this.rayonAuctionMessage = await RayonAuctionMessage.new();
    this.rayonAuction = await RayonAuction.new();
  });

  describe('regist and get content', function() {
    it('regist and get Content', async function() {
      const title = 'hello world';
      const content = 'hello everyone';
      const financeData = 'money:200||car:good';
      const userName = 'jemoy';
      await this.rayonAuction.registerAuctionContent(title, content, financeData, userName);

      const expectedAuctionContent = [new BigNumber(0), title, content, financeData, userName, msgSender];
      await this.rayonAuction.getContent(0).should.eventually.deep.equal(expectedAuctionContent);
    });
  });

  describe('send message', function() {
    it('send and get message', async function() {
      await this.rayonAuctionMessage.sendMessage(0, 0, msgSender, 1, 'nonono');

      const expectedAuctionMessage = [new BigNumber(0),new BigNumber(0),msgSender,msgSender,new BigNumber(1),'nonono',false];
      await this.rayonAuctionMessage.getMessage(0, 0).should.eventually.deep.equal(expectedAuctionMessage);
    });
  });
});