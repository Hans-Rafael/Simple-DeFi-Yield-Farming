import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Owner address: ${deployer.address}`);

  console.log("Deploying LPToken...");
  const lpTokenFactory = await ethers.getContractFactory("LPToken");
  const lpToken = await lpTokenFactory.deploy(deployer.address);
  await lpToken.waitForDeployment(); // Cambiado por ethers.js v6
  console.log("LPToken deployed to:", lpToken.target); // target reemplaza address en ethers.js v6

  console.log("Deploying DAppToken...");
  const dAppTokenFactory = await ethers.getContractFactory("DAppToken");
  const dAppToken = await dAppTokenFactory.deploy(deployer.address);
  await dAppToken.waitForDeployment(); // Cambiado por ethers.js v6
  console.log("DAppToken deployed to:", dAppToken.target); // target reemplaza address en ethers.js v6
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});