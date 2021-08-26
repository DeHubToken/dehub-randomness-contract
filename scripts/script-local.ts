// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {
	Contract,
	ContractFactory,
	ContractReceipt,
	ContractTransaction,
} from 'ethers';
import { ethers } from 'hardhat';
import { amounts, chainLink, testing } from '../settings';

async function main() {
	// Getting the first signer as the deployer
	const [deployer] = await ethers.getSigners();
	// Saving the info to be logged in the table (deployer address)
	var deployerLog = { Label: 'Deploying Address', Info: deployer.address };
	// Saving the info to be logged in the table (deployer address)
	var deployerBalanceLog = {
		Label: 'Deployer BNB Balance',
		Info: ethers.utils.formatEther(await deployer.getBalance()),
	};

	let mockERC20Fact: ContractFactory;
	// Creating the instance and contract info for the mock rand gen
	let randGenInst: Contract, randGenFact: ContractFactory;
	// Creating the random number consumer mock contract instance.
	let mockConsumerInst: Contract, mockConsumerFact: ContractFactory;
	// Creating the instance and contract of all the contracts needed to mock
	// the ChainLink contract ecosystem.
	let linkInst: Contract;
	let mockVRFCoordInst: Contract, mockVRFCoordFact: ContractFactory;

	// Getting the mockERC20 code (abi, bytecode, name)
	mockERC20Fact = await ethers.getContractFactory('MockERC20');
	// Getting the DeHubRand contracts code (abi, bytecode, name)
	randGenFact = await ethers.getContractFactory('DeHubRand');
	// Getting the MockRandConsumer contracts code (abi, bytecode, name)
	mockConsumerFact = await ethers.getContractFactory('MockRandConsumer');
	// Getting the MockVRFCoordinator contracts code (abi, bytecode, name)
	mockVRFCoordFact = await ethers.getContractFactory('MockVRFCoordinator');

	// Deploys the contracts
	linkInst = await mockERC20Fact.deploy(chainLink.misc.supply);
	mockVRFCoordInst = await mockVRFCoordFact.deploy(
		linkInst.address,
		chainLink.testnet.keyHash,
		chainLink.testnet.fee
	);
	randGenInst = await randGenFact.deploy(
		mockVRFCoordInst.address,
		linkInst.address
	);
	mockConsumerInst = await mockConsumerFact.deploy(randGenInst.address);

	// Sending link to rand generator
	await linkInst.transfer(randGenInst.address, amounts.oneMillionLink);
	const linkBalance = ethers.utils.formatEther(
		await linkInst.balanceOf(randGenInst.address)
	);
	await randGenInst.setKeyHash(chainLink.testnet.keyHash);
	await randGenInst.setFee(chainLink.testnet.fee);
	await randGenInst.giveAccess(mockConsumerInst.address);

	const tx: ContractTransaction = await mockConsumerInst.getRandomNumber();
	const receipt: ContractReceipt = await tx.wait();
	const event = receipt.events?.filter((x) => {
		return x.event == 'RandomNumberRequested';
	})[0];
	const requestId = event!.args![1].toString();
	console.log('requestId', requestId);
	// Mocking the VRF Coordinator contract for random request fulfillment
	await mockVRFCoordInst
		.connect(deployer)
		.callBackWithRandomness(requestId, testing.random, randGenInst.address);
	// Saving the info to be logged in the table (deployer address)
	const linkLog = {
		Label: 'Deployed Mock Link Token Address',
		Info: linkInst.address,
	};
	const mockVRFCoordLog = {
		Label: 'Deployed Mock VRFCoordinator Token Address',
		Info: mockVRFCoordInst.address,
	};
	const randGenLog = {
		Label: 'Deployed DeHubRand Token Address',
		Info: randGenInst.address,
	};
	const randGenLinkBalanceLog = {
		Label: 'DeHubRand Link Balance',
		Info: linkBalance,
	};

	console.table([
		deployerLog,
		deployerBalanceLog,
		linkLog,
		mockVRFCoordLog,
		randGenLog,
		randGenLinkBalanceLog,
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
