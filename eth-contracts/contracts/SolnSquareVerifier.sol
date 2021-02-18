pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './ERC721Mintable.sol';
import "./Verifier.sol";
contract SolnSquareVerifier is ERC721Mintable{

    Verifier private verifierContract;

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
    constructor(address verifierAddress, string memory name, string memory symbol, string memory BTURI) ERC721Mintable(name, symbol, BTURI) public{
        verifierContract = Verifier(verifierAddress);
    }
// TODO define a solutions struct that can hold an index & an address
    struct Solution{
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] input;
        address to;
        uint256 index;
    }


// TODO define an array of the above struct
   mapping (uint256 => Solution) solutions;


// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) existingSolutions; 



// TODO Create an event to emit when a solution is added
    event solutionAdded(bytes32, address, uint);





// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address to, uint256 index) public {
        Solution memory s = Solution(a,b,c,input,to,index);
        bytes32 k = keccak256(abi.encodePacked(a,b,c,input,to,index));
        require (!existingSolutions[k], "solution is already added!");
        bool valid = verifierContract.verifyTx(a, b, c, input);
        require(valid, "solution is not valid!");
        //existingSolutions[k] = true;
        solutions[index] = s;
        existingSolutions[k] = true;
        emit solutionAdded(k, to, index);
    }

    event Minted (address, uint);
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintProof(address to, uint256 idx) public returns (bool) {
        //check that this token has not been used before
        Solution memory sol = solutions[idx];
        require(sol.index != 0, "no solution found associated with token");
        emit Minted(to, idx);
        return super.mint(to, idx);
        
    }
  










}















