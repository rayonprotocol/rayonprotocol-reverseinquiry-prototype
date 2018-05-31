
const zip = require('lodash.zip');
const { toByte32Hex } = require('./utils');
const Auction = artifacts.require('Auction');

contract('Auction', async () => {
  let auctionContract;

  before(async () => {
    auctionContract = await Auction.deployed();
  })

  context(`listing a auction`, async () => {
    const auctions = [[
      'iguana insurance',
      'I need the insurance',
      'ignaua master',
      0x3b6b5b91b0a59512b6364f9f2f872350fd60deb0
    ], [
      'loan',
      'lend me 4000 dollars',
      'hit and run',
      0x12345b91b0a59512b6364f9f2f872350fd60acf0
    ]];

    before(async () => {
      await auctionContract.registContent(...auctions[0]);
      await auctionContract.registContent(...auctions[1]);
    })

    it('gets listing auctions', async () => {
      const [ids, titles, contents, userNames,  userAddresses, timeStamps] = await auctionContract.getContentList();
      const listingAuctions = zip(
        ids,
        titles.split('||'),
        contents.split('||'),
        userNames.split('||'),
        userAddresses,
        timeStamps
      );

      assert.equal(listingAuctions.length, auctions.length, `should match the number of lising auction`);
      listingAuctions.forEach((listingAuction, index) => {
        const [, title, content, userName,  userAddress, timeStamp] = listingAuction;
        const [_title, _content, _userName, _userAddress] = auctions[index];

        assert.equal(title, _title, `should match title`);
        assert.equal(content, _content, `should match content`);
        assert.equal(userName, _userName, `should match userName`);
        assert.equal(userAddress, _userAddress, `should userAddress`);
      });
    });
  })
});
