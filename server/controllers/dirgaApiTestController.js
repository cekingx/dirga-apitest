const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const { ethers } = require('ethers');
const { abi } = require('../abi/changeme.json');

exports.read = asyncErrorHandler(async (req, res, next) => {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    res.status(400).json({
      message: "No RPC URL"
    })
  }

  const contractAddress = '0x836ec65453b42fAd5d9196eC63ee29d692168f36'
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const data = await contract.read();

  res.status(200).json({
    success: true,
    message: 'Dirga API test read endpoint working!',
    data: data
  });
})

exports.write = asyncErrorHandler(async (req, res, next) => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    res.status(400).json({
      message: "No Private Key"
    })
  }

  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    res.status(400).json({
      message: "No RPC URL"
    })
  }

  const body = req.body;
  const name = body.name;

  if (!name) {
    res.status(400).json({
      message: "No Name in body"
    })
  }

  const contractAddress = '0x836ec65453b42fAd5d9196eC63ee29d692168f36'
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const trx = await contract.write(name);
  const receipt = await trx.wait();
  const logs = receipt.logs
  let decoded = null;
  if (logs && logs.length > 0) {
    const log = logs[0];
    const iface = new ethers.Interface(abi);
    decoded = iface.parseLog(log);
  }

  res.status(200).json({
    success: true,
    message: 'Dirga API test write endpoint working!',
    data: {
      hash: trx.hash,
      decoded: {
        name: decoded.args[0],
        timestamp: Number(decoded.args[1]),
        sender: decoded.args[2]
      }
    }
  });
})
