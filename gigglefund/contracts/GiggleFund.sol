// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GiggleFund (GIGL)
 * @notice Fixed-supply gratitude & comedy tipping token for BNB Smart Chain.
 *         No transfer tax — designed to stay exchange-friendly (Binance listing path).
 */
contract GiggleFund is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    event LaughPoolFunded(address indexed from, uint256 amount);

    constructor(address initialOwner) ERC20("GiggleFund", "GIGL") Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY);
    }

    /// @notice Move tokens from treasury into the laugh-matching pool (LaughTip contract).
    function fundLaughPool(address laughTip, uint256 amount) external onlyOwner {
        require(laughTip != address(0), "GiggleFund: zero address");
        _transfer(owner(), laughTip, amount);
        emit LaughPoolFunded(laughTip, amount);
    }
}
