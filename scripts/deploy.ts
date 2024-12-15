import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Owner address: ${deployer.address}`);

  console.log("Deploying LPToken...");
  const lpTokenFactory = await ethers.getContractFactory("LPToken");
  const lpToken = await lpTokenFactory.deploy(deployer.address);
  await lpToken.waitForDeployment(); // Cambiado por ethers.js v6
  const lpTokenAddress = lpToken.target; // guardo la //direccion del contratos ya desplegado
  //"0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  console.log("LPToken deployed to:", lpToken.target); // target reemplaza address en ethers.js v6

  console.log("Deploying DAppToken...");
  const dAppTokenFactory = await ethers.getContractFactory("DAppToken");
  const dAppToken = await dAppTokenFactory.deploy(deployer.address);
  await dAppToken.waitForDeployment(); // Cambiado por ethers.js v6
  const dAppTokenAddress = dAppToken.target; //direccion del contratos ya desplegado
  //"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  console.log("DAppToken deployed to:", dAppToken.target); // target reemplaza address en ethers.js v6
  
  // luego de Obtener las direcciones de los contratos ya desplegados
  // Desplegar el contrato de TokenFarm
  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(dAppTokenAddress, lpTokenAddress);
  await tokenFarm.waitForDeployment();
  console.log("TokenFarm deployed to:", tokenFarm.target);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});