const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const abi = require("../abi/RealEstateRegistry.abi.json");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "0x59c6995e998f97a5a0044966f094538e6f31d5f3af6ef4fcdbf95f7e0f8f8f53",
  provider
);
const contractAddress = process.env.CONTRACT_ADDRESS || "";

let contract = null;
if (contractAddress) {
  contract = new ethers.Contract(contractAddress, abi, wallet);
}

function checkContract(req, res, next) {
  if (!contract) {
    return res.status(400).json({
      message: "Contract address topilmadi. .env da CONTRACT_ADDRESS ni kiriting."
    });
  }
  next();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "real-estate-backend" });
});

app.post("/property/register", checkContract, async (req, res) => {
  try {
    const { propertyType, location, area, metadataURI } = req.body;
    const tx = await contract.registerProperty(propertyType, location, area, metadataURI);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/property/:id/verify/:owner", checkContract, async (req, res) => {
  try {
    const result = await contract.verifyOwner(req.params.id, req.params.owner);
    res.json({ isOwner: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/property/transfer", checkContract, async (req, res) => {
  try {
    const { propertyId, newOwner, note } = req.body;
    const tx = await contract.transferProperty(propertyId, newOwner, note);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/property/document", checkContract, async (req, res) => {
  try {
    const { propertyId, documentHash } = req.body;
    const tx = await contract.addDocumentHash(propertyId, documentHash);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/property/access/grant", checkContract, async (req, res) => {
  try {
    const { propertyId, viewer } = req.body;
    const tx = await contract.grantAccess(propertyId, viewer);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/property/access/revoke", checkContract, async (req, res) => {
  try {
    const { propertyId, viewer } = req.body;
    const tx = await contract.revokeAccess(propertyId, viewer);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/property/:id/history", checkContract, async (req, res) => {
  try {
    const history = await contract.getPropertyHistory(req.params.id);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/property/:id/documents", checkContract, async (req, res) => {
  try {
    const documents = await contract.getPropertyDocuments(req.params.id);
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
