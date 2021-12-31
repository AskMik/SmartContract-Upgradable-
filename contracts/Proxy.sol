
pragma solidity >=0.8.10;


pragma solidity ^0.8.6;

contract Proxy {
  bytes32 private constant _ADMIN_SLOT = 0x73b49fe9b2415f7043a9fabd65f4f4ea3962b31d51617906e5ba75ced62a3fb9;
  bytes32 private constant _IMPLEMENTATION_SLOT = 0x42e0fb0da90f06f13d7593a53bf44cc09cbabf617547961fe2caac8f51d27773;
 
  
  constructor() {
    bytes32 slot = _ADMIN_SLOT;
    address _admin = msg.sender;
    assembly {
      sstore(slot, _admin)
    }
  }

  function admin() public view returns (address adm) {
    bytes32 slot = _ADMIN_SLOT;
    assembly {
      adm := sload(slot)
    }
  }

  function implementation() public view returns (address impl) {
    bytes32 slot = _IMPLEMENTATION_SLOT;
    assembly {
      impl := sload(slot)
    }
  }

  function upgrade(address newImplementation) external {
    require(msg.sender == admin(), 'admin only');
    bytes32 slot = _IMPLEMENTATION_SLOT;
    assembly {
      sstore(slot, newImplementation)
    }
  }

  receive() external payable {
    
  }

  fallback() external payable {
    assembly {
      let _target := sload(_IMPLEMENTATION_SLOT)
      calldatacopy(0x0, 0x0, calldatasize())
      let result := delegatecall(gas(), _target, 0x0, calldatasize(), 0x0, 0)
      returndatacopy(0x0, 0x0, returndatasize())
      switch result case 0 {revert(0, 0)} default {return (0, returndatasize())}
    }
  }
}
