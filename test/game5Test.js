const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

// Original address with incorrect checksum
const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';

async function getAddress() {
  // const signers = await ethers.getSigners();

  const randomPrivateKey = ethers.utils.randomBytes(32);

  // Create a wallet from the private key
  const wallet = new ethers.Wallet(randomPrivateKey);

  // Get the Ethereum address
  const randomAddress = wallet.address;

  if (randomAddress > threshold) {
    return getAddress();
  }
  else {
    await hre.ethers.provider.send("hardhat_setBalance", [wallet.address, "0x1000000000000000000"]);
    return { wallet, randomAddress };
  }
};

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    await game.deployed();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const { wallet, randomAddress } = await getAddress();

    const provider = hre.ethers.provider;

    const connectedWallet = wallet.connect(provider);

    await game.connect(connectedWallet).win();

    assert(await game.isWon(), 'You did not win the game');
  });
});
