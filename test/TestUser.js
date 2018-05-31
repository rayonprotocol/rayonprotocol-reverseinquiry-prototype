const [msgSender] = require('../truffle')._walletAddresses;
const User = artifacts.require('User');

contract('User', async () => {
  let userContract;

  before(async () => {
    userContract = await User.deployed();
  })

  it(`verifies a unregistered user`, async () => {
    let isUser = await userContract.isUser(msgSender);
    assert.isFalse(isUser, 'user should not be verifid');
  });

  context('signing up', async () => {
    const [_userName, _isPersonal] = ['asdf', true];

    before(async () => {
      await userContract.signUpUser(_userName, _isPersonal);
    })

    it('verifies a registered user', async () => {
      let isUser = await userContract.isUser(msgSender);
      assert.isTrue(isUser), 'user should be verifid';
    });

    it('gets registered user', async () => {
      const result = await userContract.getUser(msgSender);
      const [userName, isPersonal, isPassKyc, isExist]  = result;

      assert.equal(userName, _userName, `should match userName`);
      assert.equal(isPersonal, _isPersonal, `should match isPersonal`);
      assert.isFalse(isPassKyc, `KYC should be not passed yet`);
      assert.isTrue(isExist, `should exist`);
    });

    it('gets user athenticated', async () => {
      await userContract.authUser(msgSender);
      const [, , isPassKyc] = await userContract.getUser(msgSender);
      assert.isTrue(isPassKyc, `KYC should be passed`);
    });
  });

});
