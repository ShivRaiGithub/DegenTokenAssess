const { expect } = require("chai");

describe("DegenToken", function () {
 let DegenToken;
 let hardhatToken;
 let owner;
 let addr1;
 let addr2;
 let addrs;

 beforeEach(async function () {
 DegenToken = await ethers.getContractFactory("DegenToken");
 [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

 hardhatToken = await DegenToken.deploy();
 await hardhatToken.deployed();
 });

 describe("Deployment", function () {
 it("Should set the right owner", async function () {
   expect(await hardhatToken.owner()).to.equal(owner.address);
 });

 it("Should assign the total supply of tokens to the owner", async function () {
   const ownerBalance = await hardhatToken.balanceOf(owner.address);
   expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
 });
 });

 describe("Transactions", function () {
 it("Should mint tokens by owner", async function () {
   await hardhatToken.mint(owner.address, 200);
   expect(await hardhatToken.balanceOf(owner.address)).to.equal(200);
 });

 it("Should fail if sender doesn’t have enough tokens", async function () {
  await expect(
    hardhatToken.connect(addr1).transfer(owner.address, 1000)
  ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
});

 it("Should mint tokens for addr1 and addr2", async function () {
   await hardhatToken.mint(addr1.address, 100);
   await hardhatToken.mint(addr2.address, 50);
   expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
   expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
 });

 it("Should transfer tokens between accounts", async function () {
   await hardhatToken.mint(addr1.address, 50);
   await hardhatToken.connect(addr1).transfer(addr2.address, 50);
   const addr2Balance = await hardhatToken.balanceOf(addr2.address);
   expect(addr2Balance).to.equal(50);
 });

 
 it("Should update balances after transfers", async function () {
  await hardhatToken.mint(addr1.address, 50);
   const initialAddr1Balance = await hardhatToken.balanceOf(addr1.address);
   const initialAddr2Balance = await hardhatToken.balanceOf(addr2.address);
    
   await hardhatToken.connect(addr1).transfer(addr2.address, 50);

   const finalAddr1Balance = await hardhatToken.balanceOf(addr1.address);
   expect(finalAddr1Balance).to.equal(initialAddr1Balance - 50);

   const finalAddr2Balance = await hardhatToken.balanceOf(addr2.address);
   expect(finalAddr2Balance).to.equal(initialAddr2Balance + 50);
 });
 });
});
