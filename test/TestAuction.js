const [msgSender] = require('../truffle')._walletAddresses;
const RayonAuction = artifacts.require('RayonAuction');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'))
  .should();

contract('RayonAuction', async () => {
  beforeEach(async function() {
    this.rayonAuction = await RayonAuction.new();
  });

  describe('regist and get content', function() {
    it('regist and get Content', async function() {
      const title = 'hello world';
      const content = 'hello everyone';
      const financeData = 'money:200||car:good';
      const userName = 'jemoy';
      await this.rayonAuction.registAuctionContent(title, content, financeData, userName);

      const expectedAuctionContent = [new BigNumber(0), title, content, financeData, userName, msgSender];
      await this.rayonAuction.getContent(0).should.eventually.deep.equal(expectedAuctionContent);
    });
  });
});
