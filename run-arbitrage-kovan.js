require("dotenv").config();
const Web3 = require("web3");
const abis = require("./abis");
const { kovan: addresses } = require("./addresses");
const Arbitrage = require("./build/contracts/TestArbitrage.json");

const web3 = new Web3(process.env.INFURA_URL);
const { address: admin } = web3.eth.accounts.wallet.add(
  process.env.PRIVATE_KEY
);
console.log(web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY));

const kyber = new web3.eth.Contract(
  abis.kyber.kyberNetworkProxy,
  addresses.kyber.kyberNetworkProxy
);

const init = async () => {
  const networkId = await web3.eth.net.getId();
  const arbitrage = new web3.eth.Contract(
    Arbitrage.abi,
    Arbitrage.networks[networkId].address
  );

  const dai = new web3.eth.Contract(abis.tokens.erc20, addresses.tokens.dai);

  console.log(await dai.methods.balanceOf(arbitrage.options.address).call());
  console.log(await dai.methods.balanceOf(admin).call());
  console.log(await web3.eth.getBalance(admin));
  console.log("address check", arbitrage.options.address);
  await dai.methods.approve(arbitrage.options.address, 10).send({
    from: admin,
    gas: 500000,
    gasPrice: 20e9,
  });
  console.log(" Arbitrage ", arbitrage.options.address);
  console.log("Kyber +++++++++++____\n\n\n\n\n\n\n");
  const KtU = await arbitrage.methods.kyberToUniswap(10).send({
    from: admin,
    gas: 1000000,
  });
  console.log("this is the returned address", KtU);
  console.log(await dai.methods.balanceOf(admin).call());
  console.log(await web3.eth.getBalance(arbitrage.options.address));
};
init();
