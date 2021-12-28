const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {BigNumber}= require("ethers")
function toWei(n){
    return ethers.utils.parseEther(n);
}

describe("Token & it's Proxy flow test : ", () => {
    let 
        owner,a1,a2,a3,a4,
        token1, token2;

    it ("Token1 Deployment : ", async() =>{
        [owner,a1,a2,a3,a4]=  await ethers.getSigners();
        const Token1 =  await ethers.getContractFactory("Token1");
        token1 = await upgrades.deployProxy(Token1, [owner.address]);
        await token1.deployed();
        console.log('====================================');
        console.log(token1.address);
        console.log('====================================');
    });

    
    it ("deploy the initialize function : ", async() =>{
    });

    it("should mint the specific amount of tokens to the owner: ", async()=>{

        const Balance = await token1.supplyOfTokens;
        expect(await owner.balance).to.equal(Balance);
    });



    it("should transfer the specific amount of tokens to the buyer address: ", async() =>{
        expect(await token1.balanceOf(owner.address)).to.eq(toWei("10000"));
        await token1.connect(owner).approve(a1.address,toWei("1000"));
        await token1.connect(a1).buy(toWei("1"));
        // expect(await (a1.balance)).to.equal(50);
    }); 
    
    
    it("deploy token2: ",async()=>{
        const Token2 = await ethers.getContractFactory("Token2AKAProxy");
        token2 = await Token2.deploy(/* remove this commit phrase here you will right your constructor parameters */ );
        await token2.deployed();
    });
    
});