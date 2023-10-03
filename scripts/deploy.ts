import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contracts with the account:", await deployer.getAddress());

  const Privatar = await ethers.getContractFactory("Privatar");
  const privatar = await Privatar.deploy();
  await privatar.waitForDeployment();

  console.log(`Privatar deployed to ${await privatar.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
