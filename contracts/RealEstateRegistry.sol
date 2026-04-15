// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RealEstateRegistry {
    enum PropertyType {
        House,
        Land,
        Office
    }

    struct Property {
        uint256 id;
        PropertyType propertyType;
        string location;
        uint256 area;
        address owner;
        string metadataURI;
        bool exists;
    }

    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
        string note;
    }

    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => string[]) private propertyDocuments;
    mapping(uint256 => TransferRecord[]) private propertyHistory;
    mapping(uint256 => mapping(address => bool)) private accessList;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);
    event OwnershipTransferred(uint256 indexed propertyId, address indexed from, address indexed to);
    event DocumentAdded(uint256 indexed propertyId, string documentHash);
    event AccessGranted(uint256 indexed propertyId, address indexed viewer);
    event AccessRevoked(uint256 indexed propertyId, address indexed viewer);

    modifier propertyExists(uint256 propertyId) {
        require(properties[propertyId].exists, "Property not found");
        _;
    }

    modifier onlyOwner(uint256 propertyId) {
        require(properties[propertyId].owner == msg.sender, "Only owner allowed");
        _;
    }

    function registerProperty(
        PropertyType propertyType,
        string calldata location,
        uint256 area,
        string calldata metadataURI
    ) external returns (uint256) {
        require(area > 0, "Area must be > 0");
        require(bytes(location).length > 3, "Location too short");

        propertyCount++;
        uint256 newId = propertyCount;

        properties[newId] = Property({
            id: newId,
            propertyType: propertyType,
            location: location,
            area: area,
            owner: msg.sender,
            metadataURI: metadataURI,
            exists: true
        });

        accessList[newId][msg.sender] = true;
        propertyHistory[newId].push(
            TransferRecord({
                from: address(0),
                to: msg.sender,
                timestamp: block.timestamp,
                note: "Initial registration"
            })
        );

        emit PropertyRegistered(newId, msg.sender);
        return newId;
    }

    function verifyOwner(uint256 propertyId, address user)
        external
        view
        propertyExists(propertyId)
        returns (bool)
    {
        return properties[propertyId].owner == user;
    }

    function transferProperty(
        uint256 propertyId,
        address newOwner,
        string calldata note
    ) external propertyExists(propertyId) onlyOwner(propertyId) {
        require(newOwner != address(0), "Invalid new owner");
        address oldOwner = properties[propertyId].owner;

        properties[propertyId].owner = newOwner;
        accessList[propertyId][newOwner] = true;
        accessList[propertyId][oldOwner] = false;

        propertyHistory[propertyId].push(
            TransferRecord({
                from: oldOwner,
                to: newOwner,
                timestamp: block.timestamp,
                note: note
            })
        );

        emit OwnershipTransferred(propertyId, oldOwner, newOwner);
    }

    function addDocumentHash(uint256 propertyId, string calldata documentHash)
        external
        propertyExists(propertyId)
        onlyOwner(propertyId)
    {
        require(bytes(documentHash).length > 10, "Invalid hash");
        propertyDocuments[propertyId].push(documentHash);
        emit DocumentAdded(propertyId, documentHash);
    }

    function grantAccess(uint256 propertyId, address viewer)
        external
        propertyExists(propertyId)
        onlyOwner(propertyId)
    {
        accessList[propertyId][viewer] = true;
        emit AccessGranted(propertyId, viewer);
    }

    function revokeAccess(uint256 propertyId, address viewer)
        external
        propertyExists(propertyId)
        onlyOwner(propertyId)
    {
        accessList[propertyId][viewer] = false;
        emit AccessRevoked(propertyId, viewer);
    }

    function canAccess(uint256 propertyId, address viewer)
        external
        view
        propertyExists(propertyId)
        returns (bool)
    {
        return accessList[propertyId][viewer];
    }

    function getPropertyDocuments(uint256 propertyId)
        external
        view
        propertyExists(propertyId)
        returns (string[] memory)
    {
        require(accessList[propertyId][msg.sender], "No access");
        return propertyDocuments[propertyId];
    }

    function getPropertyHistory(uint256 propertyId)
        external
        view
        propertyExists(propertyId)
        returns (TransferRecord[] memory)
    {
        require(accessList[propertyId][msg.sender], "No access");
        return propertyHistory[propertyId];
    }
}
