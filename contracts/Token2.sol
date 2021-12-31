//SPDX-License-Identifier: MIT

pragma solidity >0.8.0;
import "hardhat/console.sol";


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token2 is   Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable{ 

uint supplyOfTokens;
uint tokensLeft;
address _owner;
address payable contractAddress;




    function initialize(address owner_) public initializer {
        __ERC20_init("Token1" , "T1");
        __Ownable_init();
        __UUPSUpgradeable_init();
        supplyOfTokens = 10000 * 10 ** 18;
        _owner = owner_;
        contractAddress = payable(address(this));
        _mint(_owner, supplyOfTokens);
    }


    

    function buy(address _address, uint tokensQuantity) public payable returns(bool){
        //require(msg.value >= tokensQuantity, "not enough tokens");
        transfer(_address, tokensQuantity);
        tokensLeft = supplyOfTokens - tokensQuantity;
        return true;
    }

    function mint(address to, uint amount) public onlyOwner{
        _mint(to, amount);
    }

    function burn(uint burningTokensAmount) public {
        _burn(msg.sender, burningTokensAmount);
    }


    //New function for upgraded version of the contract
    function LeftTokens() public view returns(uint){
        return tokensLeft;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

}
