const TokenGating = artifacts.require("TokenGating.sol");

module.exports = function (deployer) {
  deployer.deploy(TokenGating);
};
