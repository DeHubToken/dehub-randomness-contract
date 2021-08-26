// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../interfaces/IDeHubRandConsumer.sol";
import "../interfaces/IDeHubRand.sol";
import "hardhat/console.sol";

// THIS CONTRACT IS ONLY FOR TESTING
contract MockRandConsumer is IDeHubRandConsumer {
	// Storing of the randomness generator 
	IDeHubRand internal randomGenerator_;
	// Request ID for random number
	bytes32 internal requestId_;
	uint public taskId = 1;

	event RandomNumberRequested(uint taskId, bytes32 requestId_);

	constructor(address _IDeHubRand) {
		randomGenerator_ = IDeHubRand(_IDeHubRand);
	}

	// Returns pure number, just for testing.
	function viewCurrentTaskId() external override view returns (uint256) {
		return taskId;
	}

	// ONLY FOR TESTING DIRECT REQUESTS OF RANDOM NUMBERS THROUGH DEHUBRAND CONTRACT
	// In real life scenarion 'randomGenerator_.getRandomNumber()' should be called
	// inside the contract business logic (e.x. draw numbers for lottery etc.).
	function getRandomNumber() external {
		requestId_ = randomGenerator_.getRandomNumber();
		console.log("requestId bellow:");
		console.logBytes32(requestId_);
		emit RandomNumberRequested(taskId, requestId_);
	}
}