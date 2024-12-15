import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenFarm", function () {
  let dappToken: any; //ethers.Contract;
  let lpToken: any; //ethers.Contract;
  let tokenFarm: any; //ethers.Contract;

  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const DAppTokenFactory = await ethers.getContractFactory("DAppToken");
    dappToken = await DAppTokenFactory.deploy(owner.address);
    await dappToken.waitForDeployment(); //V5 deployed()

    const LPTokenFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPTokenFactory.deploy(owner.address);
    await lpToken.waitForDeployment();

    const TokenFarmFactory = await ethers.getContractFactory("TokenFarm");
    tokenFarm = await TokenFarmFactory.deploy(
      dappToken.address,
      lpToken.address
    );
    await tokenFarm.waitForDeployment();
  });

  it("should mint LP tokens and deposit them", async function () {
    await lpToken.connect(owner).mint(addr1.address, 1000);
    await lpToken.connect(addr1).approve(tokenFarm.getAddress(), 1000);
    await tokenFarm.connect(addr1).deposit(100);

    const stakingBalance = await tokenFarm.stakingInfo(addr1.address);
    expect(stakingBalance.stakingBalance).to.equal(100);
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
    await lpToken.connect(owner).mint(addr1.address, 1000);
    await lpToken.connect(addr1).approve(tokenFarm.getAddress(), 1000);
    await tokenFarm.connect(addr1).deposit(100);

    // Simulate passing of blocks
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);

    await tokenFarm.distributeRewardsAll();

    const initialBalance = await dappToken.balanceOf(addr1.address);
    await tokenFarm.connect(addr1).claimRewards();

    const finalBalance = await dappToken.balanceOf(addr1.address);
    expect(finalBalance).to.be.gt(initialBalance); // Final balance should be greater than initial
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

  it("should charge a fee on rewards claim and allow owner to withdraw the fee", async function () {
    await lpToken.connect(owner).mint(addr1.address, 1000);
    await lpToken.connect(addr1).approve(tokenFarm.getAddress(), 1000);
    await tokenFarm.connect(addr1).deposit(100);

    // Simulate passing of blocks
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);

    await tokenFarm.distributeRewardsAll();

    const initialOwnerBalance = await dappToken.balanceOf(owner.address);
    await tokenFarm.connect(addr1).claimRewards();

    const finalOwnerBalance = await dappToken.balanceOf(owner.address);
    expect(finalOwnerBalance).to.be.gt(initialOwnerBalance); // Owner balance should be greater due to fee
  });
});
