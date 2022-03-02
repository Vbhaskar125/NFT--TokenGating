// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TokenGating is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    event collectionCreated(string indexed nameOfCollection);

    constructor() ERC721("tokenGating", "gate") {
        
     }

    struct collection{
        string collectionName;
        uint256[] tokenIdListOfCollection;
    }
    collection[] public collections;

    struct promo{
        string promoName;
        string[] eligibleCollections;
        string[] earlyAccessCollections;
    }

    promo[] promos;

//map tokenid to collection
mapping(uint256 => string) tokenIdToCollectionmap;


/*

collection A - tokenid 0, 1
collection B - tokenid 2, 3
collection C - tokenid 4, 5
collection D - tokenid 6, 7
// createCollection(uint[] memory ids, string memory name) returns (uint256 indexOfCollection)
//getcollection(string name) returns (uint[] memory)


promo 1 -- eligible collection =A, earlyaccess=C
promo 2 -- eligible collection =B, earlyaccess=D

getEligibleTokens(promo1, userOwnedTokenId){
promo[] = gsteligiblePromos(userownedTokenId)
foreach(promo[]){
    uint256[]= tokenIdList(promo.earlyaccesscollection)
}
}

//getallEAtokens(address) returns (int[] memory)returns(uint[] memory){
    promo[] EApromos= getAllEligiblePromos(address);
   uint256[] EATokenIds = getAllEATokenIds(promo[] );
   return EATokenIds; 
}

back                           front
                                address
string[] collectionsOwned       
promo[] promos                  
                                compile eligible promos
                                compile eligibleEAcollection
getCollection               
                                append the int[] to get EAtokenIds



 */

function createCollection(string memory _name, uint256[] memory _ids) public returns(uint256){
    collection memory newCollection;
    newCollection.collectionName= _name;
    newCollection.tokenIdListOfCollection= _ids;
    //map ids to collection
    uint256 len = _ids.length;
    for(uint256 i=0;i<len;i++){
        tokenIdToCollectionmap[_ids[i]]= _name;
    }

    collections.push(newCollection);
    emit collectionCreated(_name);
    return collections.length;
}

function getCollection(string memory _name)view public returns (uint256[] memory){
    uint256 len = collections.length;
    for(uint256 i=0;i<len;i++){
        string memory colName = collections[i].collectionName ;
        if(keccak256(abi.encodePacked(colName)) == keccak256(abi.encodePacked(_name))){
            return collections[i].tokenIdListOfCollection;
        }
    }
    uint256[] memory nullRet;
    return nullRet;
    
}

function getCollectionSize(string memory _name)view public returns(uint256){
    uint256 len = collections.length;
    for(uint256 i=0;i<len;i++){
        string memory colName = collections[i].collectionName ;
        if(keccak256(abi.encodePacked(colName)) == keccak256(abi.encodePacked(_name))){
            return collections[i].tokenIdListOfCollection.length;
        }
    }
    return 0;
}

function createPromo(string memory _name, string[] memory _eligibleColl, string[] memory _earlyAccessColl) public returns(uint256 ){
    promo memory newPromo;
    newPromo.promoName = _name;
    newPromo.eligibleCollections =_eligibleColl;
    newPromo.earlyAccessCollections = _earlyAccessColl;
    promos.push(newPromo);
    return promos.length;
}

function getPromo(string memory _name) public view returns(promo memory){
    uint256 len = promos.length;
    for(uint256 i=0; i<len;i++){
        promo memory selectedPromo = promos[i];
        if(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked(selectedPromo.promoName))){
            return selectedPromo;
        }
    }
}

function getOwnedCollection(address _visitor) public view returns(string[] memory){
    uint256 _bal = balanceOf(_visitor);
    require(_bal > 0 ,"visitor does not own any Nft");
    string[] memory listOfCollections = new string[](_bal);
    for(uint256 i=0; i<_bal;i++){
        uint256 _tId = tokenOfOwnerByIndex(_visitor,i);
        listOfCollections[i] = tokenIdToCollectionmap[_tId];
    }
    return listOfCollections;
}

function getAllPromos() public view returns(promo[] memory allprom){
    promo[] memory  allprom= promos;
    return allprom;
}

// function getAlltokensOfCollectionArray(string[] memory _EACollections)view public returns(uint256[] memory _EATokenIds){
//     //no of collections
//     uint256 colLen = _EACollections.length;
//     uint256 tIdLen;
//     //no of tokenids in collections and create memory array
//     for(uint256 i=0;i<colLen;i++){
//         tIdLen += getCollectionSize(_EACollections[i]);        
//     }
//     //append all tokenids and return
//     uint256[] memory _EATokenIds = new uint256[](tIdLen);
//     for(uint256 i=0;i<colLen;i++){
//         uint[]  memory currList = getCollection(_EACollections[i]); 
//         uint256 aas =getCollectionSize(_EACollections[i]);
//         for(uint256)

//     }

// }




//create collection object having ids of nfts in that collection
// create promo object having {eligible collections, earlyaccess collections}
//fetch eligible promos
//fetch early access nfts from eligible collections







    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmXotJxCaRHNkqwHmMkfr6eMTjiE3xHCcFgcm6Fyyc91zN/";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        uint256 metaId= (tokenId %9)+1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        string memory tokenadd= string(abi.encodePacked(Strings.toString(metaId),".json"));
        _setTokenURI(tokenId, tokenadd);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
