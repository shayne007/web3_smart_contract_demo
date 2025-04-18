const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let SimpleToken;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    SimpleToken = await ethers.getContractFactory("SimpleToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new SimpleToken contract before each test
    const initialSupply = ethers.utils.parseUnits("1000000", 18);
    token = await SimpleToken.deploy("Demo Token", "DEMO", 18, initialSupply);
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right name, symbol and decimals", async function () {
      expect(await token.name()).to.equal("Demo Token");
      expect(await token.symbol()).to.equal("DEMO");
      expect(await token.decimals()).to.equal(18);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      const transferAmount = ethers.utils.parseUnits("50", 18);
      await token.transfer(addr1.address, transferAmount);
      
      // Check balances
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
      
      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, transferAmount);
      
      // Check balances
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      // Try to send more tokens than owner has
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient balance");

      // Owner balance shouldn't have changed
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting and Burning", function () {
    it("Should mint tokens to an address", async function () {
      const mintAmount = ethers.utils.parseUnits("100", 18);
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(addr1.address);
      
      await token.mint(addr1.address, mintAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply.add(mintAmount));
      expect(await token.balanceOf(addr1.address)).to.equal(initialBalance.add(mintAmount));
    });

    it("Should burn tokens from an address", async function () {
      const burnAmount = ethers.utils.parseUnits("100", 18);
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(owner.address);
      
      await token.burn(burnAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply.sub(burnAmount));
      expect(await token.balanceOf(owner.address)).to.equal(initialBalance.sub(burnAmount));
    });
  });
});