import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners(); //deployer es la cuenta que se usa para desplegar el contrato
  console.log("Deploying contracts with the account:", deployer.address);

  //deploy DAppToken
  const DAppToken = await ethers.getContractFactory("DAppToken"); //obtenemos el contrato de DAppToken
  const dAppToken = await DAppToken.deploy(deployer.address); //desplegamos el contrato de DAppToken
  await dAppToken.deployed(); //esperamos a que se despliegue el contrato
  console.log("DAppToken deployed to:", dAppToken.address);

  //deploy LPToken
  const LPToken = await ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy(deployer.address);
  await lpToken.deployed();
  console.log("LPToken deployed to:", lpToken.address);
}
main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
