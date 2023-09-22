// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string name;
        string description;
        uint256 serialNumber;
        bool exists;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductAdded(uint256 indexed productId, string name, string description, uint256 serialNumber);
    
    function addProduct(string memory _name, string memory _description, uint256 _serialNumber) public {
        require(!products[_serialNumber].exists, "Product with this serial number already exists");
        uint256 productId = productCount++;
        products[productId] = Product(_name, _description, _serialNumber, true);
        emit ProductAdded(productId, _name, _description, _serialNumber);
    }
}
