//SPDX-License-Identifier: MIT

pragma solidity >0.8.0;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token1 is   Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable{ 

uint supplyOfTokens = 10000 * 10 ** 18;

    function initialize() public initializer {
        __ERC20_init("Token1" , "T1");
        __Ownable_init();
        __UUPSUpgradeable_init();
        _mint(msg.sender, supplyOfTokens);
    }


    constructor() initializer{}

    function buy(uint amountToBeBought) public payable returns(bool){
        require(msg.value >= amountToBeBought);
        transfer(msg.sender, amountToBeBought);
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