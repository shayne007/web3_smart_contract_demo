// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleToken
 * @dev A simple ERC20-like token implementation
 */
contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    // Mapping from addresses to balances
    mapping(address => uint256) public balanceOf;
    
    // Mapping of approved token transfers
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    /**
     * @dev Constructor that initializes the token details
     */
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        
        // Mint initial supply to the contract creator
        mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Transfer tokens from sender to recipient
     * @param _to The recipient address
     * @param _value The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    /**
     * @dev Approve spender to withdraw from your account up to _value
     * @param _spender The address authorized to spend
     * @param _value The amount authorized to spend
     * @return success Whether the approval was successful
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param _from The source address
     * @param _to The recipient address
     * @param _value The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    /**
     * @dev Mint new tokens (only contract owner can call this)
     * @param _to The address that will receive the minted tokens
     * @param _value The amount of tokens to mint
     * @return success Whether the minting was successful
     */
    function mint(address _to, uint256 _value) public returns (bool success) {
        // In a real contract, you would add access control here
        require(_to != address(0), "Mint to zero address");
        
        balanceOf[_to] += _value;
        totalSupply += _value;
        
        emit Mint(_to, _value);
        emit Transfer(address(0), _to, _value);
        return true;
    }
    
    /**
     * @dev Burn tokens from sender's balance
     * @param _value The amount of tokens to burn
     * @return success Whether the burning was successful
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        
        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0), _value);
        return true;
    }
}