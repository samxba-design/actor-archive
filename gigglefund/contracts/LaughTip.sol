// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {CharityVault} from "./CharityVault.sol";

/**
 * @title LaughTip
 * @notice Tip comedians & creators with GIGL. Optional charity split + laugh-match rewards.
 *
 * Unique structure:
 *  - On-chain "thank you" with reaction type (laugh, fire, clap, heart)
 *  - Tipper chooses charity % (0–50%) — joy shared, not forced transfer tax
 *  - Registered creators receive protocol match from the laugh pool (up to 25% of tip)
 */
contract LaughTip is Ownable, ReentrancyGuard {
    IERC20 public immutable gigglToken;
    CharityVault public immutable charityVault;

    uint16 public constant MAX_CHARITY_BPS = 5000; // 50%
    uint16 public constant MAX_MATCH_BPS = 2500; // 25% protocol match cap
    uint16 public matchBps = 1000; // default 10% match for verified creators

    uint256 public laughPoolBalance;
    uint256 public totalTips;
    uint256 public totalCharityRouted;
    uint256 public totalMatched;

    enum Reaction {
        THANKS,
        LAUGH,
        FIRE,
        CLAP,
        HEART
    }

    struct TipRecord {
        address tipper;
        address recipient;
        uint256 grossAmount;
        uint256 charityAmount;
        uint256 matchAmount;
        Reaction reaction;
        string message;
        uint256 timestamp;
    }

    mapping(bytes32 => TipRecord) public tips;
    mapping(address => bool) public verifiedCreators;
    mapping(address => uint256) public tipsReceived;
    mapping(address => uint256) public tipsSent;

    event CreatorVerified(address indexed creator, bool status);
    event MatchBpsUpdated(uint16 oldBps, uint16 newBps);
    event LaughPoolDeposited(uint256 amount);
    event TipSent(
        bytes32 indexed tipId,
        address indexed tipper,
        address indexed recipient,
        uint256 netToRecipient,
        uint256 charityAmount,
        uint256 matchAmount,
        Reaction reaction,
        string message
    );

    constructor(address token, address vault, address initialOwner) Ownable(initialOwner) {
        require(token != address(0) && vault != address(0), "LaughTip: zero address");
        gigglToken = IERC20(token);
        charityVault = CharityVault(vault);
    }

    function setVerifiedCreator(address creator, bool status) external onlyOwner {
        verifiedCreators[creator] = status;
        emit CreatorVerified(creator, status);
    }

    function setMatchBps(uint16 newBps) external onlyOwner {
        require(newBps <= MAX_MATCH_BPS, "LaughTip: match too high");
        uint16 old = matchBps;
        matchBps = newBps;
        emit MatchBpsUpdated(old, newBps);
    }

    /// @notice Treasury seeds the laugh-matching pool (also callable via token.fundLaughPool).
    function depositLaughPool(uint256 amount) external nonReentrant {
        require(amount > 0, "LaughTip: zero amount");
        require(gigglToken.transferFrom(msg.sender, address(this), amount), "LaughTip: deposit failed");
        laughPoolBalance += amount;
        emit LaughPoolDeposited(amount);
    }

    /// @notice Credit pool balance when GIGL was transferred in via GiggleFund.fundLaughPool.
    function creditLaughPool(uint256 amount) external onlyOwner {
        require(amount > 0, "LaughTip: zero amount");
        laughPoolBalance += amount;
        emit LaughPoolDeposited(amount);
    }

    /**
     * @param recipient Creator or friend you're thanking
     * @param amount Total GIGL to tip (gross, including charity slice)
     * @param charityBps Portion sent to CharityVault (0–5000)
     * @param reaction On-chain reaction / thank-you style
     * @param message Short thank-you note (keep gas reasonable)
     */
    function tip(
        address recipient,
        uint256 amount,
        uint16 charityBps,
        Reaction reaction,
        string calldata message
    ) external nonReentrant returns (bytes32 tipId) {
        require(recipient != address(0), "LaughTip: zero recipient");
        require(recipient != msg.sender, "LaughTip: self tip");
        require(amount > 0, "LaughTip: zero amount");
        require(charityBps <= MAX_CHARITY_BPS, "LaughTip: charity too high");
        require(bytes(message).length <= 280, "LaughTip: message too long");

        tipId = keccak256(
            abi.encodePacked(msg.sender, recipient, amount, block.timestamp, totalTips)
        );

        uint256 charityAmount = (amount * charityBps) / 10_000;
        uint256 afterCharity = amount - charityAmount;

        uint256 matchAmount = 0;
        if (verifiedCreators[recipient] && laughPoolBalance > 0) {
            matchAmount = (afterCharity * matchBps) / 10_000;
            if (matchAmount > laughPoolBalance) {
                matchAmount = laughPoolBalance;
            }
        }

        uint256 netToRecipient = afterCharity;

        require(
            gigglToken.transferFrom(msg.sender, address(this), amount),
            "LaughTip: pull failed"
        );

        if (charityAmount > 0) {
            require(
                gigglToken.transfer(address(charityVault), charityAmount),
                "LaughTip: charity failed"
            );
            charityVault.recordDeposit(charityAmount, tipId);
            totalCharityRouted += charityAmount;
        }

        if (matchAmount > 0) {
            laughPoolBalance -= matchAmount;
            netToRecipient += matchAmount;
            totalMatched += matchAmount;
        }

        require(
            gigglToken.transfer(recipient, netToRecipient),
            "LaughTip: recipient failed"
        );

        tips[tipId] = TipRecord({
            tipper: msg.sender,
            recipient: recipient,
            grossAmount: amount,
            charityAmount: charityAmount,
            matchAmount: matchAmount,
            reaction: reaction,
            message: message,
            timestamp: block.timestamp
        });

        totalTips += 1;
        tipsReceived[recipient] += netToRecipient;
        tipsSent[msg.sender] += amount;

        emit TipSent(
            tipId,
            msg.sender,
            recipient,
            netToRecipient,
            charityAmount,
            matchAmount,
            reaction,
            message
        );
    }
}
