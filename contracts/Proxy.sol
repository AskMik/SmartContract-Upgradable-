
pragma solidity >=0.8.10;


contract Proxy{
    
    // Storage position of the address of the current logic code (Token1.sol)
    bytes32 private constant logicAddress = 
        keccak256("0xaE036c65C649172b43ef7156b009c6221B596B8b");
    
    // Storage position of the owner of the proxy contract
    bytes32 private constant proxyOwnerPosition = 
        keccak256("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
    
    bytes32 testingVariable = proxyOwnerPosition;
    
    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyProxyOwner() {
        require (msg.sender == proxyOwner());
        _;


    }
    
    /**
    * @dev the constructor sets owner
    */
    constructor() public {
        _setUpgradeabilityOwner(msg.sender);
    }
    
    /**
     * @dev Allows the current owner to transfer ownership
     * @param _newOwner The address to transfer ownership to
     */
    function transferProxyOwnership(address _newOwner) 
        public onlyProxyOwner 
    {
        require(_newOwner != address(0));
        _setUpgradeabilityOwner(_newOwner);
    }
    
    /**
     * @dev Allows the proxy owner to upgrade the implementation
     * @param _implementation address of the new implementation
     */
    function upgradeTo(address _implementation) 
        public onlyProxyOwner
    {
        _upgradeTo(_implementation);
    }
    
    
    function implementation() public view returns(address impl) {
       bytes32 I_position = logicAddress;
        assembly {
            impl := sload(I_position)
        }
    }
    

    function proxyOwner() public view returns (address owner) {
        bytes32 O_position = proxyOwnerPosition;
        assembly {
            owner := sload(O_position)
        }
    }
    
    /**
     * @dev Sets the address of the current implementation
     * @param _newImplementation address of the new implementation
     */
    function _setImplementation(address _newImplementation) 
        internal 
    {
        bytes32 position = logicAddress;
        assembly {
            sstore(position, _newImplementation)
        }
    }
    
    /**
     * @dev Upgrades the implementation address
     * @param _newImplementation address of the new implementation
     */
    function _upgradeTo(address _newImplementation) internal {
        address currentImplementation = implementation();
        require(currentImplementation != _newImplementation);
        _setImplementation(_newImplementation);
    }
    
    /**
     * @dev Sets the address of the owner
     */
    function _setUpgradeabilityOwner(address _newProxyOwner) 
        internal 
    {
        bytes32 position = proxyOwnerPosition;
        assembly {
            sstore(position, _newProxyOwner)
        }
    }
}