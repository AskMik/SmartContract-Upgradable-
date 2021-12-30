const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Token & it's Proxy flow test : ", () => {
    let 
        owner,a1, a2, proxyowner,
         supplyOfTokens,
        initialOwnerBalance, Token1, token1, Token2, token2, Proxy, proxy,
        finalOwnerBalance, initial, final, bAddress;

    beforeEach(async()=> {

        [owner,a1, a2]=  await ethers.getSigners();
       
    });

    it ("Token1 Deployment : ", async() =>{
       
        Token1 =  await ethers.getContractFactory("Token1");
        token1 = await upgrades.deployProxy(Token1, [owner.address], {initializer : 'initialize'});
        await token1.deployed();
        

       

    });


    
    it ("owner should deploy the initialize function : ", async() =>{
        expect(await token1.owner()).to.equal(owner.address);
        initialOwnerBalance = await token1.balanceOf(owner.address);
        initial = parseInt(initialOwnerBalance);

    });

    it("should mint the specific amount of tokens to the owner: ", async()=>{
        supplyOfTokens = await token1.supplyOfTokens;
        expect(await owner.balance).to.equal(supplyOfTokens);
    });
/*

//failed test for the user other than owner (checked)

    it("should not mint the tokens to the user other than owner: ", async() => {
        await token1.connect(a1).mint(a2.address, 2);
    })
*/

    it("should transfer the specific amount of tokens to the buyer address: ", async() =>{
        await token1.buy(a1.address, 50);
        let a1Balance = await token1.balanceOf(a1.address);
        expect (a1Balance).to.equal(50);
        
    
    }); 
    
    it("should mint new tokens to the owner:", async() => {
        await token1.connect(owner).mint(owner.address, 200);
        finalOwnerBalance = await token1.balanceOf(owner.address);
        final = parseInt(finalOwnerBalance);
        expect (await initial).to.equal (final + 150);
        
    });

    it("should burn the tokens: ", async() => {
        await token1.connect(a1).burn(5);
        expect (await token1.balanceOf(a1.address)).to.equal(45);
    });



    it("should deploy token2: ", async()=> {
    Token2 = await ethers.getContractFactory("Token2");
    token2 = await upgrades.deployProxy(Token2,  [owner.address], {initializer : 'initialize'})
    await token2.deployed();
    })

    it("should deploy Proxy contract ", async()=>{
        Proxy = await ethers.getContractFactory("Proxy");
        proxy = await Proxy.deploy();
        await token2.deployed();

    });

    it("should set right owner: ", async() => {
        proxyowner = owner.address;
        bAddress = proxyowner.toString(32);
        expect (await proxy.proxyOwner()).to.equal(bAddress);
    })

   it("it should upgrade the logic Address: ", async() => {
       await proxy.upgradeTo(token1.address);
       expect(await proxy.implementation()).to.equal(token1.address);
   });

   it("it should update the logic Contract Address: ", async() =>{
       await proxy.upgradeTo(token2.address);
       expect(await proxy.implementation()).to.equal(token2.address);

   })

  

});

