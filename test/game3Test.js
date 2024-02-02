const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const [signer1, signer2, signer3] = await ethers.getSigners();

    return { game, signer1, signer2, signer3 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);

    // Buy some amount for each signer
    await game.connect(signer1).buy({ value: '1' });
    await game.connect(signer2).buy({ value: '2' });
    await game.connect(signer3).buy({ value: '3' });

    // TODO: win expects three arguments
    await game.win(await signer2.getAddress(), await signer3.getAddress(), await signer1.getAddress());

    // // TODO: win expects three arguments
    // await game.win(await signer.getAddress(),await signer.getAddress(),await signer.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
