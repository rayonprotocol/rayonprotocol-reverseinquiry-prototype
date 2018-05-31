const [msgSender] = require('../truffle')._walletAddresses;
const bigNumber = require('bignumber.js');
const Auction = artifacts.require('Auction');
const Message = artifacts.require('Message');

contract('Message', async () => {
  let auctionContract;
  let messageContract;
  let auctoinAuthorAddr = 0x3b6b5b91b0a59512b6364f9f2f872350fd60deb0;

  // auction should be listed before messages are made
  before(async() => {
    auctionContract = await Auction.deployed();
    await auctionContract.registContent('hihi', 'asdfasdf', 'fdsafds', auctoinAuthorAddr);
    messageContract = await Message.deployed(auctionContract.address);
  })

  context('inserting a message', async () => {
    const [_toAddresses, _auctionId, _msgType, _payload] = [
      auctoinAuthorAddr,
      0,
      1,
      `"연봉", "나이"` // 필요한 항목명
    ];
    let _timeStamp;

    before(async () => {
      _timeStamp = Math.trunc(Date.now() / 1000);
      await messageContract.insertMessage(_toAddresses, _auctionId, _msgType, _payload);
    })

    it(`gets user's own messages`, async () => {
      const [[fromAddresses], [toAddresses], [auctionId], [msgType], [timeStamp], payloads] = await messageContract.getUserMessages()
      const [payload] = payloads.split("||");

      assert.equal(fromAddresses, msgSender, `fromAddresses should match`);
      assert.equal(toAddresses, _toAddresses, `toAddresses should match`);
      assert.equal(auctionId.toString(), _auctionId.toString(), `auctionId should match`);
      assert.equal(msgType.toString(), _msgType.toString(), `msgType should match`);
      assert.isAtLeast(timeStamp.toString(), _timeStamp.toString(), 'timeStamp should be greater or equal');
      assert.equal(payload, _payload, `payload should match`);
    });

  })
})
