const GroupPayment = artifacts.require("GroupPayment");

module.exports = function (deployer) {
  deployer.deploy(GroupPayment);
};
