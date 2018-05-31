const toByte32Hex = (str) => {
  const byte32HexLength = 32 * (16 / 8) + 2;
  return web3.padRight(web3.toHex(str.slice(0, 32)), byte32HexLength);
};

module.exports = {
  toByte32Hex
};
