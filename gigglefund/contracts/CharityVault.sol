// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CharityVault
 * @notice Transparent on-chain treasury for comedy & mental-health charity payouts.
 */
contract CharityVault is Ownable, ReentrancyGuard {
    IERC20 public immutable gigglToken;

    uint256 public totalReceived;
    uint256 public totalDistributed;

    mapping(address => bool) public depositors;

    event DepositorUpdated(address indexed account, bool allowed);
    event Received(address indexed from, uint256 amount, bytes32 tipId);
    event Distributed(
        address indexed charity,
        uint256 amount,
        string cause,
        address indexed distributor
    );

    constructor(address token, address initialOwner) Ownable(initialOwner) {
        require(token != address(0), "CharityVault: zero token");
        gigglToken = IERC20(token);
    }

    function setDepositor(address account, bool allowed) external onlyOwner {
        depositors[account] = allowed;
        emit DepositorUpdated(account, allowed);
    }

    function recordDeposit(uint256 amount, bytes32 tipId) external {
        require(depositors[msg.sender], "CharityVault: not depositor");
        totalReceived += amount;
        emit Received(msg.sender, amount, tipId);
    }

    /// @notice Release funds to a verified charity wallet. Use a multisig for owner in production.
    function distribute(
        address charity,
        uint256 amount,
        string calldata cause
    ) external onlyOwner nonReentrant {
        require(charity != address(0), "CharityVault: zero charity");
        require(amount > 0, "CharityVault: zero amount");
        require(gigglToken.balanceOf(address(this)) >= amount, "CharityVault: insufficient");

        totalDistributed += amount;
        require(gigglToken.transfer(charity, amount), "CharityVault: transfer failed");

        emit Distributed(charity, amount, cause, msg.sender);
    }

    function balance() external view returns (uint256) {
        return gigglToken.balanceOf(address(this));
    }
}
