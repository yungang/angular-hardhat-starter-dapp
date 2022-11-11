require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    }
  },
  solidity: '0.8.4',
}
