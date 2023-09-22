
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import QrReader from 'react-qr-scanner'
import { ethers } from "ethers";
import abi from "./ProductRegistry.json";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [scannedData, setScannedData] = useState("");
  const [verificationResult, setVerificationResult] = useState("");
  const [generatedQRCode, setGeneratedQRCode] = useState(null);
 
  useEffect(() => {
    
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3(web3Provider);

      const contractAddress = "0x79B68729e30E7E158CDBAe42793cdA82aa23FCb1";
      const contract = new ethers.Contract(
        contractAddress,
        abi.abi,
        web3Provider.getSigner()
      );
      setContract(contract);

      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);
    } else {
      console.log("Please install MetaMask.");
    }
  }

  

  const addProduct = async () => {
    if (contract) {
      try {
        const productx = await contract.addProduct(
          productName,
          productDescription,
          serialNumber
        );
        setGeneratedQRCode(productx); 
        alert("Product added to blockchain.");
      } catch (error) {
        console.error(error);
        alert("Error adding product to blockchain.");
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleScan = (data) => {
    if (data) {
      setScannedData(data); 
    }
  };

  const verifyProduct = async () => {
    if (contract) {
      try {
        const product = await contract.products(scannedData);
        if (product.exists) {
          setVerificationResult("Product is verified.");
        } else {
          setVerificationResult("Product not found or not verified.");
        }
      } catch (error) {
        console.error(error);
        setVerificationResult("Error verifying product.");
      }
    }
  };

  return (
    <div className="App">
      <h1>Product Identification</h1>
      <div className="add-product">
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <button onClick={addProduct}>Add Product</button>
        {generatedQRCode && (
          <div>
            <h2>Generated QR Code:</h2>
            <QRCode value={generatedQRCode} />
          </div>
        )}
      </div>
      <div className="verify-product">
        <h2>Verify Product</h2>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan()}
          style={{ width: "40%" }}
        />
        <div>
        <button onClick={verifyProduct}>Verify Product</button>
        <p>{verificationResult}</p>
        </div>
        
      </div>
    </div>
  );
}

export default App;


