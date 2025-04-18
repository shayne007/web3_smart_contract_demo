// This script is meant to be used with Hardhat or Truffle
// Example: npx hardhat run deploy.js --network <network_name>

async function main() {
  // Get the contract factory
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  
  // Deploy the contract with constructor arguments
  // Name: "Demo Token", Symbol: "DEMO", Decimals: 18, Initial Supply: 1,000,000 tokens
  const initialSupply = ethers.utils.parseUnits("1000000", 18);
  const token = await SimpleToken.deploy("Demo Token", "DEMO", 18, initialSupply);
  
  // Wait for deployment to finish
  await token.deployed();
  
  console.log("SimpleToken deployed to:", token.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });