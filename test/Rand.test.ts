import { Contract, ContractFactory } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect, assert } from 'chai';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { ethers, network } from 'hardhat';
import { amounts, chainLink, testing } from '../settings';

describe('DeHubRand contract', function () {
	let mockERC20Fact: ContractFactory;
	// Instance and contract info for the mock rand gen
	let randGenInst: Contract, randGenFact: ContractFactory;
	// Creating the random number consumer mock contract instance.
	let mockConsumerInst: Contract, mockConsumerFact: ContractFactory;
	// Instance and contract of all the contracts needed to mock the ChainLink contract ecosystem.
	let linkInst: Contract;
	let mockVRFCoordInst: Contract, mockVRFCoordFact: ContractFactory;

	// Users
	let owner: SignerWithAddress, buyer: SignerWithAddress;

	beforeEach(async () => {
		// Getting the signers provided by ethers
		const signers = await ethers.getSigners();
		// Creating the active wallets for use
		owner = signers[0];
		buyer = signers[1];

		// Getting contract code (abi, bytecode, name)
		mockERC20Fact = await ethers.getContractFactory('MockERC20');
		randGenFact = await ethers.getContractFactory('DeHubRand');
		mockConsumerFact = await ethers.getContractFactory('MockRandConsumer');
		mockVRFCoordFact = await ethers.getContractFactory('MockVRFCoordinator');

		// Deploying the instances
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
	});

	describe('Random number generator tests', function () {
		it('Should revert because no access.', async function () {
			await expect(mockConsumerInst.getRandomNumber()).to.be.revertedWith(
				'Contract has no access.'
			);
		});
		it('Should revert because no keyhash.', async function () {
			await randGenInst.giveAccess(mockConsumerInst.address);
			await expect(mockConsumerInst.getRandomNumber()).to.be.revertedWith(
				'Must have valid key hash.'
			);
		});
		it('Should revert because not enough LINK tokens.', async function () {
			await randGenInst.giveAccess(mockConsumerInst.address);
			await randGenInst.setKeyHash(chainLink.testnet.keyHash);
			await randGenInst.setFee(chainLink.testnet.fee);
			await expect(mockConsumerInst.getRandomNumber()).to.be.revertedWith(
				'Not enough LINK tokens.'
			);
		});
		it('Should return random number.', async function () {
			await randGenInst.giveAccess(mockConsumerInst.address);
			await randGenInst.setKeyHash(chainLink.testnet.keyHash);
			await randGenInst.setFee(chainLink.testnet.fee);
			await linkInst.transfer(randGenInst.address, amounts.oneMillionLink);
			// Call get random number and catch the requestId emitted
			const tx: ContractTransaction = await mockConsumerInst.getRandomNumber();
			const receipt: ContractReceipt = await tx.wait();
			const event = receipt.events?.filter((x) => {
				return x.event == 'RandomNumberRequested';
			})[0];
			const requestId = event!.args![1].toString();
			// Mock the VRF Coordinator contract for random request fulfillment
			// (always returns same number for testing)
			await expect(
				mockVRFCoordInst
					.connect(owner)
					.callBackWithRandomness(
						requestId,
						testing.mockSeed,
						randGenInst.address
					)
			)
				.to.emit(randGenInst, testing.events.randFullfilled)
				// Checking that emitted event contains correct information
				.withArgs(requestId, testing.randomReturn, mockConsumerInst.address, 1);
		});
	});
});
