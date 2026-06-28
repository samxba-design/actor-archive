import { expect } from "chai";
import { ethers } from "hardhat";
import { GiggleFund, LaughTip, CharityVault } from "../typechain-types";

describe("GiggleFund ecosystem", function () {
  async function deployFixture() {
    const [owner, tipper, creator, charityWallet] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GiggleFund");
    const token = (await Token.deploy(owner.address)) as GiggleFund;

    const Vault = await ethers.getContractFactory("CharityVault");
    const vault = (await Vault.deploy(await token.getAddress(), owner.address)) as CharityVault;

    const Tip = await ethers.getContractFactory("LaughTip");
    const laughTip = (await Tip.deploy(
      await token.getAddress(),
      await vault.getAddress(),
      owner.address
    )) as LaughTip;

    await vault.setDepositor(await laughTip.getAddress(), true);
    const poolSeed = ethers.parseEther("1000000");
    await token.fundLaughPool(await laughTip.getAddress(), poolSeed);
    await laughTip.creditLaughPool(poolSeed);

    await laughTip.setVerifiedCreator(creator.address, true);

    return { token, vault, laughTip, owner, tipper, creator, charityWallet };
  }

  it("mints 1B GIGL to owner", async function () {
    const { token, owner } = await deployFixture();
    expect(await token.totalSupply()).to.equal(ethers.parseEther("1000000000"));
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.parseEther("999000000")
    );
  });

  it("tips creator with charity split and laugh match", async function () {
    const { token, vault, laughTip, owner, tipper, creator } = await deployFixture();

    const tipAmount = ethers.parseEther("1000");
    const charityBps = 1000; // 10%

    await token.transfer(tipper.address, tipAmount);
    await token.connect(tipper).approve(await laughTip.getAddress(), tipAmount);

    const charityBefore = await token.balanceOf(await vault.getAddress());
    const creatorBefore = await token.balanceOf(creator.address);

    await laughTip
      .connect(tipper)
      .tip(creator.address, tipAmount, charityBps, 1, "You made my day!");

    const charityAfter = await token.balanceOf(await vault.getAddress());
    const creatorAfter = await token.balanceOf(creator.address);

    const charityReceived = charityAfter - charityBefore;
    expect(charityReceived).to.equal(ethers.parseEther("100"));

    // 900 after charity + 10% match (90) = 990
    const creatorReceived = creatorAfter - creatorBefore;
    expect(creatorReceived).to.equal(ethers.parseEther("990"));
  });

  it("rejects self-tips and excessive charity", async function () {
    const { token, laughTip, tipper } = await deployFixture();
    const amount = ethers.parseEther("10");
    await token.transfer(tipper.address, amount);
    await token.connect(tipper).approve(await laughTip.getAddress(), amount);

    await expect(
      laughTip.connect(tipper).tip(tipper.address, amount, 0, 0, "nope")
    ).to.be.revertedWith("LaughTip: self tip");

    await expect(
      laughTip.connect(tipper).tip(await tipper.getAddress(), amount, 5001, 0, "nope")
    ).to.be.reverted;
  });

  it("allows charity vault distribution by owner", async function () {
    const { token, vault, laughTip, owner, tipper, creator, charityWallet } =
      await deployFixture();

    const tipAmount = ethers.parseEther("500");
    await token.transfer(tipper.address, tipAmount);
    await token.connect(tipper).approve(await laughTip.getAddress(), tipAmount);
    await laughTip.connect(tipper).tip(creator.address, tipAmount, 2000, 2, "LOL");

    const vaultBalance = await vault.balance();
    await vault.connect(owner).distribute(charityWallet.address, vaultBalance, "Comedy relief");

    expect(await token.balanceOf(charityWallet.address)).to.equal(vaultBalance);
  });
});
