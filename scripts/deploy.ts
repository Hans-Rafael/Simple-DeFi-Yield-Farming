import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners(); //deployer es la cuenta que se usa para desplegar el contrato
  console.log("Deploying contracts with the account:", deployer.address);

  //deploy DAppToken
  const DAppToken = await ethers.getContractFactory("DAppToken");
  const dAppToken = await DAppToken.deploy(deployer.address); // Pasar parámetros al constructor

  await dAppToken.deployed(); // Esperar el despliegue

  console.log("DAppToken deployed to:", dAppToken.address);

  // Desplegar el contrato LPToken
  const LPToken = await ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy(deployer.address); // Pasar parámetros al constructor

  await lpToken.deployed(); // Esperar el despliegue

  console.log("LPToken deployed to:", lpToken.address);
}
main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
