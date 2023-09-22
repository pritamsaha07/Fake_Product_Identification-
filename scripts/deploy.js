const hre = require("hardhat");
async function main() {
   
    const fake_pro=await hre.ethers.getContractFactory("ProductRegistry");
    const contract=await fake_pro.deploy();
  
    await contract.deployed();
   
    console.log("Address of contract:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });