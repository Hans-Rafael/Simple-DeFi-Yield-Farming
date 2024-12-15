import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenFarm", function () {
  let dappToken: any; //ethers.Contract;
  let lpToken: any; //ethers.Contract;
  let tokenFarm: any; //ethers.Contract;

  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DAppTokenFactory = await ethers.getContractFactory("DAppToken");
    dappToken = await DAppTokenFactory.deploy(owner.address);
    const dappTokenAddress = await dappToken.getAddress();
    console.log("DAppToken deployed at:", dappTokenAddress);
    const LPTokenFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPTokenFactory.deploy(owner.address);
    const lpTokenAddress = await lpToken.getAddress();
    console.log("LPToken deployed at:", lpTokenAddress);
    const TokenFarmFactory = await ethers.getContractFactory("TokenFarm");
    tokenFarm = await TokenFarmFactory.deploy(dappTokenAddress, lpTokenAddress);
    const tokenFarmAddress = await tokenFarm.getAddress();
    console.log("TokenFarm deployed at:", tokenFarmAddress);

    // Transfer ownership of DAppToken to TokenFarm
  await dappToken.transferOwnership(await tokenFarm.getAddress());
  });
  it("should mint LP tokens and deposit them", async function () {
    const tokenFarmAddress = await tokenFarm.getAddress();
    console.log("TokenFarm Address:", tokenFarmAddress);

    await lpToken.connect(owner).mint(addr1.address, 1000);
    console.log("Minted 1000 LP tokens to addr1");

    await lpToken.connect(addr1).approve(tokenFarmAddress, 1000);
    console.log("Approved 1000 LP tokens for TokenFarm");

    await tokenFarm.connect(addr1).deposit(100);
    console.log("Deposited 100 LP tokens in TokenFarm");

    const stakingInfo = await tokenFarm.stakingInfo(addr1.address);
    console.log("Staking Info:", stakingInfo);
    expect(stakingInfo.stakingBalance).to.equal(100);
  });

  it("should distribute rewards correctly", async function () {
    await lpToken.connect(owner).mint(addr1.address, 1000);
    await lpToken.connect(addr1).approve(tokenFarm.getAddress(), 1000);
    await tokenFarm.connect(addr1).deposit(100);

    // Simulate passing of blocks
    await ethers.provider.send("evm_increaseTime", [100]); // increase time by 100 seconds
    await ethers.provider.send("evm_mine", []); // mine a new block

    await tokenFarm.distributeRewardsAll();

    const stakingInfo = await tokenFarm.stakingInfo(addr1.address);
    expect(stakingInfo.pendingRewards).to.be.gt(0); // Should have some pending rewards
  });

  it("should allow user to claim rewards and transfer them correctly", async function () {
    const tokenFarmAddress = await tokenFarm.getAddress();
    console.log("TokenFarm Address:", tokenFarmAddress);
    await lpToken.connect(owner).mint(addr1.address, 1000);
    console.log("Minted 1000 LP tokens to addr1");
    await lpToken.connect(addr1).approve(tokenFarmAddress, 1000);
    console.log("Approved 1000 LP tokens for TokenFarm");
    await tokenFarm.connect(addr1).deposit(100);
    console.log("Deposited 100 LP tokens in TokenFarm");
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);
    console.log("Time increased and new block mined");
    await tokenFarm.distributeRewardsAll();
    console.log("Distributed rewards");
    const initialBalance = await dappToken.balanceOf(addr1.address);
    console.log("Initial DAppToken Balance:", initialBalance.toString());
    await tokenFarm.connect(addr1).claimRewards();
    console.log("Claimed rewards");
    const finalBalance = await dappToken.balanceOf(addr1.address);
    console.log("Final DAppToken Balance:", finalBalance.toString());
    expect(finalBalance).to.be.gt(initialBalance);
  });

  it("should allow user to unstake all LP tokens and claim pending rewards", async function () {
    await lpToken.connect(owner).mint(addr1.address, 1000);
    await lpToken.connect(addr1).approve(tokenFarm.getAddress(), 1000);
    await tokenFarm.connect(addr1).deposit(100);

    // Simulate passing of blocks
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);

    await tokenFarm.distributeRewardsAll();

    await tokenFarm.connect(addr1).withdraw();
    const stakingInfo = await tokenFarm.stakingInfo(addr1.address);
    expect(stakingInfo.stakingBalance).to.equal(0); // Staking balance should be zero
  });
  it("should allow user to unstake all LP tokens and claim pending rewards", async function () {
    const tokenFarmAddress = await tokenFarm.getAddress();
    console.log("TokenFarm Address:", tokenFarmAddress);
    await lpToken.connect(owner).mint(addr1.address, 1000);
    console.log("Minted 1000 LP tokens to addr1");
    await lpToken.connect(addr1).approve(tokenFarmAddress, 1000);
    console.log("Approved 1000 LP tokens for TokenFarm");
    await tokenFarm.connect(addr1).deposit(100);
    console.log("Deposited 100 LP tokens in TokenFarm");
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);
    console.log("Time increased and new block mined");
    await tokenFarm.distributeRewardsAll();
    console.log("Distributed rewards");
    await tokenFarm.connect(addr1).withdraw();
    console.log("Withdrew all LP tokens");
    const stakingInfo = await tokenFarm.stakingInfo(addr1.address);
    console.log("Staking Info:", stakingInfo);
    expect(stakingInfo.stakingBalance).to.equal(0);
  });
  it("should charge a fee on rewards claim and allow owner to withdraw the fee", async function () {
    const tokenFarmAddress = await tokenFarm.getAddress();
    console.log("TokenFarm Address:", tokenFarmAddress);
    await lpToken.connect(owner).mint(addr1.address, 1000);
    console.log("Minted 1000 LP tokens to addr1");
    await lpToken.connect(addr1).approve(tokenFarmAddress, 1000);
    console.log("Approved 1000 LP tokens for TokenFarm");
    await tokenFarm.connect(addr1).deposit(100);
    console.log("Deposited 100 LP tokens in TokenFarm");
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);
    console.log("Time increased and new block mined");
    await tokenFarm.distributeRewardsAll();
    console.log("Distributed rewards");
    const initialOwnerBalance = await dappToken.balanceOf(owner.address);
    console.log(
      "Initial Owner DAppToken Balance:",
      initialOwnerBalance.toString()
    );
    await tokenFarm.connect(addr1).claimRewards();
    console.log("Claimed rewards");
    const finalOwnerBalance = await dappToken.balanceOf(owner.address);
    console.log("Final Owner DAppToken Balance:", finalOwnerBalance.toString());
    expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
  });
});
