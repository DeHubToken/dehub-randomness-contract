//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev THIS CONTRACT IS FOR TESTING PURPOSES ONLY.
 */
contract MockERC20 is ERC20 {
	constructor(uint256 _supply) ERC20("DeHub", "DeHub") {
		_mint(msg.sender, _supply);
	}

	function mint(address _to, uint256 _amount) public {
		_mint(_to, _amount);
	}

	/**
	 * @dev This function is only here to accommodate nested Link token 
	 *      functionality required in mocking the random number calls.
	 */
	function transferAndCall(
		address to, 
		uint256 value, 
		bytes calldata data
	) 
		external 
		pure
		returns(bool success) 
	{
		return true;
	}
}
