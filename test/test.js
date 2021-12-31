const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {BigNumber} = require ("ethers");

describe("Token & it's Proxy flow test : ", () => {
    let 
        owner,a1, a2, a3, a4,
         supplyOfTokens,
        initialOwnerBalance, Token1, token1, Token2, token2, Proxy, proxy,
        finalOwnerBalance, initial, final, proxyupdate, token2_via_proxy; 

    beforeEach(async()=> {

        [owner,a1, a2, a3, a4]=  await ethers.getSigners();
        
    });
    

    //test1
    it ("Token1 Deployment : ", async() =>{

        Token1 =  await ethers.getContractFactory("Token1");
        //upgrades.deployProxy takes 3 arguments 
        //1- first contract's getContractFactory
        //2- parameters in initializer
        //3- first function of the contract name as initializer
        token1 = await upgrades.deployProxy(Token1, [owner.address], {initializer : 'initialize'});
        await token1.deployed();
        console.log("==================================================");
        console.log("Token1 : ", token1.address);
        console.log("==================================================");     
    });


    //test2
    it ("owner should deploy the initialize function : ", async() =>{
        expect(await token1.owner()).to.equal(owner.address);
        initialOwnerBalance = await token1.balanceOf(owner.address);
        initial = parseInt(initialOwnerBalance);
        console.log("==================================================");
        console.log("owner : ", owner.address);
        console.log("==================================================");    
    });

    
    //test3
   
    it("should mint the specific amount of tokens to the owner: ", async()=>{
        supplyOfTokens = await BigNumber.from("10000000000000000000000");
        expect(await token1.balanceOf(owner.address)).to.equal(supplyOfTokens);
        console.log("==================================================");
        console.log("supplyOfTokens : ", supplyOfTokens);
        console.log("==================================================");     
    });
/*


     //test4
//failed test for the user other than owner (checked)

    it("should not mint the tokens to the user other than owner: ", async() => {
        await token1.connect(a1).mint(a2.address, 2);
    })
*/

    //test5
    it("should transfer the specific amount of tokens to the buyer address: ", async() =>{
        await token1.buy(a1.address, 50);
        let a1Balance = await token1.balanceOf(a1.address);
        expect (a1Balance).to.equal(50);
        
    
    }); 
    

    //test6
    it("should mint new tokens to the owner:", async() => {
        await token1.connect(owner).mint(owner.address, 200);
        finalOwnerBalance = await token1.balanceOf(owner.address);
        final = parseInt(finalOwnerBalance);
        expect (await initial).to.equal (final + 150);
    });


    //test7
    it("should burn the tokens: ", async() => {
        await token1.connect(a1).burn(5);
        expect (await token1.balanceOf(a1.address)).to.equal(45);
    });



    //test8
    it("should deploy token2: ", async()=> {
    Token2 = await ethers.getContractFactory("Token2");
    //here "upgrades.upgradeProxy" will use for the Upgraded Contract
    //this will take 2 arguments
    //1- address of the first contract which had been deployed.
    //2- contractFactory of a new contract address
    token2 = await upgrades.upgradeProxy(token1.address, Token2);
    await token2.deployed();
    })

    

    //simple deployment
    //test9
    it("should deploy Proxy contract ", async()=>{
        Proxy = await ethers.getContractFactory("Proxy");
        proxy = await Proxy.deploy();
        await proxy.deployed();
        console.log("==================================================");
        console.log("Proxy :" , proxy.address);
        console.log("==================================================");
    });

  
    //test9
   it ("should upgrade the Implementation address of Proxy contract to token2 contract address: ", async() => {
       await proxy.upgrade(token2.address);
       //have to convert the address to bytes32 cause logic contract(token2) has address converted in bytes32
       expect(await proxy.implementation()).to.equal((token2.address).toString(32));
   });

   
   //test10
   it("creating a new contract instance of proxy contract with logic(implementation)", async() =>{
       //Making instance "token2_via_proxy" with new Contract factory address.attach()
       //This will take one argument which is the address of the deployed contract.
       token2_via_proxy = await Token2.attach(token1.address);
       proxyupdate = token2_via_proxy.address;
       console.log("==================================================");
       console.log("token2_via_proxy : ", proxy.address);
       console.log("==================================================");
   });


   //test11
   //checking the proxy contracts
   it("should access the logic contract functions through proxy contract :", async() => {
       await token2_via_proxy.buy(a4.address, 20);
      expect(await token2_via_proxy.balanceOf(a4.address)).to.equal(20);

   })

   

//All Done!


});

