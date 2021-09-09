// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
	Contract,
	ContractFactory,
	ContractInterface,
	ContractReceipt,
	ContractTransaction,
} from 'ethers';
// Allows to access extended ethers with hardhat plugins.
import hre from 'hardhat';
import { amounts, chainLink } from '../settings';

async function main() {
	const abi: ContractInterface = [
		'function balanceOf(address) public view returns(uint256)',
		'function transfer(address recipient, uint256 amount) public returns(bool)',
	];
	// Getting all signers
	const signers = await hre.ethers.getSigners();
	// Find deployer signer in signers.
	let deployer: SignerWithAddress | undefined;
	signers.forEach((a) => {
		if (a.address === process.env.DEPLOYER001) {
			deployer = a;
		}
	});
	if (!deployer) {
		throw new Error(`${process.env.DEPLOYER001} not found in signers!`);
	}
	// Saving the info to be logged in the table (deployer address)
	const deployerLog = { Label: 'Deploying Address', Info: deployer.address };
	// Saving the info to be logged in the table (deployer address)
	const deployerBalanceLog = {
		Label: 'Deployer BNB Balance',
		Info: hre.ethers.utils.formatEther(await deployer!.getBalance()),
	};

	// Instance and contract info for the mock rand gen
	let randGenInst: Contract, randGenFact: ContractFactory;
	// Random number consumer mock contract instance.
	let mockConsumerInst: Contract, mockConsumerFact: ContractFactory;
	// Instance to ChainLink contract signed by deployer
	let linkInstAsDeployer: Contract;

	// Getting contract code (abi, bytecode, name)
	randGenFact = await hre.ethers.getContractFactory('DeHubRand');
	// Getting the MockRandConsumer contracts code (abi, bytecode, name)
	// We will need this only for TESTNET so that we can interact with the DeHubRand
	// through this contract. On MAINNET we will use real contracts.
	mockConsumerFact = await hre.ethers.getContractFactory('MockRandConsumer');

	// Deploys the contracts
	randGenInst = await randGenFact.deploy(
		chainLink.testnet.vrfCoordinator,
		chainLink.testnet.token
	);
	mockConsumerInst = await mockConsumerFact.deploy(randGenInst.address);
	linkInstAsDeployer = new hre.ethers.Contract(
		chainLink.testnet.token,
		abi,
		deployer
	);

	// Sending link to rand generator
	await linkInstAsDeployer.transfer(randGenInst.address, amounts.oneLink);
	const linkBalance = hre.ethers.utils.formatEther(
		await linkInstAsDeployer.balanceOf(randGenInst.address)
	);
	await randGenInst.giveAccess(mockConsumerInst.address);
	await randGenInst.setKeyHash(chainLink.testnet.keyHash);
	await randGenInst.setFee(chainLink.testnet.fee);

	// Verifies the contracts
	await hre.run('verify:verify', {
		address: randGenInst.address,
		constructorArguments: [
			chainLink.testnet.vrfCoordinator,
			chainLink.testnet.token,
		],
	});
	await hre.run('verify:verify', {
		address: mockConsumerInst.address,
		constructorArguments: [randGenInst.address],
	});

	// Saving the info to be logged in the table (deployer address)
	const randGenLog = {
		Label: 'Deployed DeHubRand Token Address',
		Info: randGenInst.address,
	};
	const randGenLinkBalanceLog = {
		Label: 'DeHubRand Link Balance',
		Info: linkBalance,
	};
	const mockConsumerLog = {
		Label: 'Deployed Mock consumer Token Address',
		Info: mockConsumerInst.address,
	};

	console.table([
		deployerLog,
		deployerBalanceLog,
		randGenLog,
		randGenLinkBalanceLog,
		mockConsumerLog,
	]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
