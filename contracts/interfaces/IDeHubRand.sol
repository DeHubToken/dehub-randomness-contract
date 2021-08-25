// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IDeHubRand {
	/**
	 * Requests randomness
	 */
	function getRandomNumber() external;

	/**
	 * @notice View latest id for a requesting contract
	 */
	function viewLatestId(address _contractAddr) external view returns (uint256);

	/**
	 * Views random result
	 */
	function viewRandomResult(address _contractAddr) external view returns (uint32);
}