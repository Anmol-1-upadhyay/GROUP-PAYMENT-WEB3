const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost
      port: 7545,         // Standard Ethereum port
      network_id: 5777,    // Any network id
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.DEPLOYER_PRIVATE_KEY,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        ),
      network_id: 4,  // Rinkeby's network id
      gas: 5500000,   // Gas limit
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
