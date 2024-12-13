import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAppToken and LPToken", function () {
  let owner: any;
  let addr1: any;
  let dappToken: any;
  let lpToken: any;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Desplegar el contrato DAppToken
    const DAppToken = await ethers.getContractFactory("DAppToken");
    dappToken = await DAppToken.deploy(owner.address); // El propietario es la dirección del 'owner'
    // await dappToken.deployed(); // No es necesario esto en ethers.js 6.0

    // Desplegar el contrato LPToken
    const LPToken = await ethers.getContractFactory("LPToken");
    lpToken = await LPToken.deploy(owner.address); // Pasar la dirección del 'owner' como parámetro
    // await lpToken.deployed(); // Tampoco es necesario esto
  });

  describe("DAppToken", function () {
    it("Should deploy with the correct owner", async function () {
      expect(await dappToken.owner()).to.equal(owner.address);
      console.log("Owner: ", owner.address);
    });

    it("Should mint and transfer tokens", async function () {
      // Mint tokens
      console.log("addr1 balance before mint: ", await dappToken.balanceOf(addr1.address));
      await dappToken.mint(addr1.address, 100);
      expect(await dappToken.balanceOf(addr1.address)).to.equal(100);
      console.log("expect addr1 Balance after mint iqual 100 : ", await dappToken.balanceOf(addr1.address));

      // Transfer tokens
      console.log("Owner balance before transfer: ", await dappToken.balanceOf(owner.address));
      await dappToken.connect(addr1).transfer(owner.address, 25);
      expect(await dappToken.balanceOf(owner.address)).to.equal(25);
      console.log("expect Owner balance after transfer iqual to 25 : ", await dappToken.balanceOf(owner.address));
      console.log ("addr1 balance after transfer: ",await dappToken.balanceOf(addr1.address));
    });
  });

  describe("LPToken", function () {
    it("Should deploy with the correct owner", async function () {
      expect(await lpToken.owner()).to.equal(owner.address);
    });

    it("Should mint tokens", async function () {
      await lpToken.mint(addr1.address, 100);
      expect(await lpToken.balanceOf(addr1.address)).to.equal(100);
    });
  });
});
