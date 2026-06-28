import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying GiggleFund with:", deployer.address);

  const GiggleFund = await ethers.getContractFactory("GiggleFund");
  const token = await GiggleFund.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("GIGL Token:", tokenAddress);

  const CharityVault = await ethers.getContractFactory("CharityVault");
  const vault = await CharityVault.deploy(tokenAddress, deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("CharityVault:", vaultAddress);

  const LaughTip = await ethers.getContractFactory("LaughTip");
  const laughTip = await LaughTip.deploy(tokenAddress, vaultAddress, deployer.address);
  await laughTip.waitForDeployment();
  const laughTipAddress = await laughTip.getAddress();
  console.log("LaughTip:", laughTipAddress);

  await (await vault.setDepositor(laughTipAddress, true)).wait();
  console.log("LaughTip authorized as charity depositor");

  const laughPoolSeed = ethers.parseEther("50000000"); // 5% of supply to matching pool
  await (await token.fundLaughPool(laughTipAddress, laughPoolSeed)).wait();
  await (await laughTip.creditLaughPool(laughPoolSeed)).wait();
  console.log("Laugh pool seeded:", ethers.formatEther(laughPoolSeed), "GIGL");

  const deployment = {
    network: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      GiggleFund: tokenAddress,
      CharityVault: vaultAddress,
      LaughTip: laughTipAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `deployment-${deployment.network}.json`);
  fs.writeFileSync(file, JSON.stringify(deployment, null, 2));
  console.log("Wrote", file);

  const webEnv = path.join(__dirname, "..", "web", ".env.example.local");
  fs.writeFileSync(
    webEnv,
    [
      `VITE_GIGL_TOKEN_ADDRESS=${tokenAddress}`,
      `VITE_LAUGH_TIP_ADDRESS=${laughTipAddress}`,
      `VITE_CHARITY_VAULT_ADDRESS=${vaultAddress}`,
    ].join("\n") + "\n"
  );
  console.log("Wrote web env snippet:", webEnv);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
