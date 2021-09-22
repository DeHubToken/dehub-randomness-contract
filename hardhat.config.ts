import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: 'localhost',
	networks: {
		localhost: {
			url: 'http://127.0.0.1:8545',
			forking: {
				url: process.env.MORALIS_BSC_MAINNET_ARCHIVE_URL || '',
				blockNumber: 10553446,
			},
		},
		testnet: {
			url: process.env.MORALIS_BSC_TESTNET_ARCHIVE_URL || '',
			chainId: 97,
			gasPrice: 20000000000,
			accounts:
				process.env.DEPLOYER001_PRIVATE_KEY !== undefined
					? [process.env.DEPLOYER001_PRIVATE_KEY]
					: [],
		},
		mainnet: {
			url: process.env.MORALIS_BSC_MAINNET_URL || '',
			chainId: 56,
			gasPrice: 20000000000,
			accounts:
				process.env.DEPLOYER001_PRIVATE_KEY !== undefined
					? [process.env.DEPLOYER001_PRIVATE_KEY]
					: [],
		},
		hardhat: {
			initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
		},
		ropsten: {
			url: process.env.ROPSTEN_URL || '',
			accounts:
				process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		},
	},
	solidity: {
		compilers: [
			{
				version: '0.8.4',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.6.6',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD',
		gasPrice: 10,
		ethPrice: 297,
		coinmarketcap: process.env.COINMARKETCAP_KEY || '',
	},
	etherscan: {
		apiKey: process.env.BSCSCAN_API_KEY || '',
	},
};
