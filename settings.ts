import { ethers } from 'ethers';

// https://docs.chain.link/docs/vrf-contracts/#binance-smart-chain-mainnet
export const chainLink = {
	mainnet: {
		token: '0x404460C6A5EdE2D891e8297795264fDe62ADBB75',
		vrfCoordinator: '0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31',
		keyHash:
			'0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c',
		fee: ethers.utils.parseUnits('0.2', 18),
	},
	testnet: {
		// faucet: https://linkfaucet.protofire.io/bsctest
		token: '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06',
		vrfCoordinator: '0xa555fC018435bef5A13C6c6870a9d4C11DEC329C',
		keyHash:
			'0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186',
		fee: ethers.utils.parseUnits('0.1', 18),
	},
	misc: {
		supply: ethers.utils.parseUnits('10000000', 18),
	},
};

export const amounts = {
	pointOneLink: ethers.utils.parseUnits('0.1', 18),
	oneLink: ethers.utils.parseUnits('1', 18),
	oneMillionLink: ethers.utils.parseUnits('10000000', 18),
	oneBNB: ethers.utils.parseEther('1'),
};

export const testing = {
	mockSeed: ethers.utils.parseUnits(
		'71812290232383789158325313353218754072886144180308695307717334628590412940628',
		0
	),
	randomReturn: 1940628,
	events: {
		randRequested: 'RandomNumberRequested',
		randFullfilled: 'RandomnessFulfilled',
	},
};
