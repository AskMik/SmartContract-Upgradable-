const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

/*
    token1.connect(in this bracket you will give referce of your msg.sender).buy();
    example : 
    token1.connect(owner).buy();
    remember you just have to give instance of msg.sender so dont have to write owner.address just owner or ac1 etc.
*/
describe("Token & it's Proxy flow test : ", () => {
    let 
        owner,a1,a2,a3,a4,
        token1, token2;

    it ("Token1 Deployment : ", async() =>{
        [owner,a1,a2,a3,a4]=  await ethers.getSigners();
        const Token1 =  await ethers.getContractFactory("Token1");
        token1 = await Token1.deploy(); // 👈🏾 this will make more sense to Devs.  
        await token1.deployed();
    });

    
    it ("should be called by the Owner : ", async() =>{
        await token1.initialize(); // it doesn't return you any value so expect is no use here. 

    });

    it("should mint the specific amount of tokens to the owner", async()=>{

        const Balance = await token1.supplyOfTokens;
        expect(await owner.balance).to.equal(Balance);
    });

    it("should transfer the specific amount of tokens to the buyer address", async() =>{
        await token1.buy(50);
        // after instance of contract type .connect(put address of initiater of function )
        // just as given below.  👇🏽dot connect👇🏽 address in this case owner 
        const Buyer = await token1.connect(owner).buy();
        expect (await Buyer.balance).to.equal(50);
    });

    it("deploy token2: ",async()=>{
        const Token2 = await ethers.getContractFactory("Token2AKAProxy");
        token2 = await Token2.deploy(/* remove this commit phrase here you will right your constructor parameters */ );
        await token2.deployed();
    });

});
