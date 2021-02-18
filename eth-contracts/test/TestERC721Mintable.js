var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const TURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const symbol = "URE";
    const Cname = "Udacity Real Estate"
    const NUM_TOKENS = 10
    describe('match erc721 spec', function () {
        beforeEach(async function () { 


            this.contract = await ERC721MintableComplete.new(Cname, symbol, TURI, {from: account_one});
            
            // TODO: mint 10 tokens

            for (let i = 1; i <= NUM_TOKENS ; i++){
                await this.contract.mint(account_one, i , {from: accounts[0]});
            }
           
        })

        it('should return total supply', async function () { 
            let count = await this.contract.totalSupply.call();
            assert.equal(count, NUM_TOKENS, `${NUM_TOKENS} should be minted!`);
            
        })

        it('should get token balance', async function () { 
            let bal = await this.contract.balanceOf.call(accounts[0]);
            assert.equal(bal, NUM_TOKENS, `${NUM_TOKENS} should be owned by the owner!`)
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let URI = await this.contract.tokenURI.call(1, {from: account_one});
            assert.equal('https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1',
             URI,
             "token URIs do not match");
        });

        it('should transfer token from one owner to another', async function () { 
            let token = 1;
            let step1 = await this.contract.approve(account_two, token, {from: account_one});
            let step2 = await this.contract.transferFrom(account_one, account_two, token, {
                from: account_two
            });
            let step3 = await this.contract.ownerOf.call(token);
            assert.equal(step3, account_two, "incorrect owner of token")
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(Cname, symbol, TURI, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let token = NUM_TOKENS +1;
            let reverted = false;
            try{
                await this.contract.mint(account_two, token, {from: account_two});
            }
            catch (e) {
                reverted = true;
                console.log(e);
            }
            assert.equal(reverted, true, "a non contract owner minted a token")
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call();
            assert.equal(owner, account_one, "owner is not account_one")
        })

    });
})