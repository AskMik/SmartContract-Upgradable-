//SPDX-License-Identifier: MIT

pragma solidity >0.8.0;
import "hardhat/console.sol";


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token1 is   Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable{ 

uint supplyOfTokens;
address _owner;

    function initialize(address owner_) public initializer {
        __ERC20_init("Token1" , "T1");
        __Ownable_init();
        __UUPSUpgradeable_init();
        supplyOfTokens = 10000 * 10 ** 18;
        _owner = owner_;
        _mint(_owner, supplyOfTokens);
    }


    // constructor() initializer{}

    function buy(uint _pay) public payable returns(bool){
        // require(msg.value >= _pay);
        transferFrom(_owner,msg.sender,_pay);
        return true;
    }

    function mint(address to, uint amount) public onlyOwner{
        _mint(to, amount);
    }

    function burn(uint burningTokensAmount) public {
        _burn(msg.sender, burningTokensAmount);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

}