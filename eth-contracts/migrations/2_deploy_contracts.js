// migrating the appropriate contracts
 Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");

module.exports = function(deployer) {
  let sym = "URE";
  let name = "Udacity Real Estate";
  let BTURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
  deployer.deploy(ERC721Mintable, name, sym, BTURI);
  deployer.deploy(Verifier).then(() => {

    return deployer.deploy(SolnSquareVerifier, Verifier.address, name, sym, BTURI);

  });
  
  
// deployer.deploy(SquareVerifier);
 // deployer.deploy(SolnSquareVerifier); // comment out for now
};
