// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./interfaces/IDeHubRand.sol";
import "./interfaces/IDeHubRandConsumer.sol";

contract DeHubRand is VRFConsumerBase, IDeHubRand, Ownable {
	using SafeERC20 for IERC20;

	bytes32 public keyHash;
	uint256 public fee;
	// Only these contracts will have access to this generator.
	mapping(address => bool) public hasAccess;
	mapping(address => uint32) public randomResults;
	// Link latest request id with the requesting contract.
	// This is so that we can keep track of who to assign the result to 
	// when it comes back.
	mapping(bytes32 => address) public requesters;
	// Will store latest ids for each contract which has access, this will help
	// requesting contract to know if fulfillRandomness callback has been fulfilled.
	mapping(address => uint256) public latestIds;

	event RandomnessRequested(
		bytes32 indexed requestId, 
		address indexed requester
	);
	event RandomnessFulfilled(
		bytes32 indexed requestId, 
		uint32 randomNumber,
		address indexed requester,
		uint256 indexed id
	);

	/**
	 * @notice Constructor
	 * @dev RandomNumberGenerator must be deployed before all other contracts.
	 * Once other contracts are deployed, giveAccess must be called.
	 * https://docs.chain.link/docs/vrf-contracts/
	 * @param _vrfCoordinator: address of the VRF coordinator
	 * @param _linkToken: address of the LINK token
	 */
	constructor(
		address _vrfCoordinator, 
		address _linkToken
	) VRFConsumerBase(_vrfCoordinator, _linkToken) {}

	/**
	 * @notice Request randomness
	 */
	function getRandomNumber() external override returns(bytes32) {
		address sender = _msgSender();
		console.log("Randomness requested by:", sender);
		require(hasAccess[sender], "Contract has no access.");
		require(keyHash != bytes32(0), "Must have valid key hash.");
		require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK tokens.");
		// Save request id linked to the requesting contract. 
		// So we know which random number bellongs to which address once the
		// fulfillRandomness callback is called.
		bytes32 requestId = requestRandomness(keyHash, fee);
		requesters[requestId] = sender;
		console.log("requestId bellow:");
		console.logBytes32(requestId);
		console.log("requesters[requestId]:", requesters[requestId]);
		emit RandomnessRequested(requestId, sender);
		return requestId;
	}

	/**
	 * @notice Change the fee
	 * @param _fee: new fee (in LINK)
	 */
	function setFee(uint256 _fee) external onlyOwner {
		fee = _fee;
	}

	/**
	 * @notice Change the keyHash
	 * @param _keyHash: new keyHash
	 */
	function setKeyHash(bytes32 _keyHash) external onlyOwner {
		keyHash = _keyHash;
	}

	/**
	 * @notice Give access to any contract to request randomness
	 * @param _contractAddr: address of the contract which will get the access
	 */
	function giveAccess(address _contractAddr) external onlyOwner {
		hasAccess[_contractAddr] = true;
	}

	/**
	 * @notice It allows the admin to withdraw tokens sent to the contract
	 * @param _tokenAddress: the address of the token to withdraw
	 * @param _tokenAmount: the number of token amount to withdraw
	 * @dev Only callable by owner.
	 */
	function withdrawTokens(
		address _tokenAddress, 
		uint256 _tokenAmount
	) external onlyOwner {
		IERC20(_tokenAddress).safeTransfer(address(msg.sender), _tokenAmount);
	}

	/**
	 * @notice View latest id for a requesting contract
	 */
	function viewLatestId(
		address _contractAddr
	) external view override returns (uint256) {
		return latestIds[_contractAddr];
	}

	/**
	 * @notice View random result
	 */
	function viewRandomResult(
		address _contractAddr
	) external view override returns (uint32) {
		return randomResults[_contractAddr];
	}

	/**
	 * @notice Callback function used by ChainLink's VRF Coordinator
	 */
	function fulfillRandomness(
		bytes32 requestId, 
		uint256 randomness
	) internal override {
		// Will return 6 random numbers with 1 in the begginning (ignore that first digit when parsing).
		uint32 randomResult = uint32(1000000 + (randomness % 1000000));
		address requester = requesters[requestId];
		randomResults[requester] = randomResult;
		latestIds[requester] = IDeHubRandConsumer(requester).viewCurrentTaskId();
		console.log("Randomness fulfilled:", randomResult);
		emit RandomnessFulfilled(requestId, randomResult, requester, latestIds[requester]);
	}
}