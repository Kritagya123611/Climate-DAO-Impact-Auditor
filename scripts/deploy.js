const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", admin.address);

  // Deploy Audit Registry
  const AuditRegistry = await hre.ethers.getContractFactory("AuditRegistry");
  const auditRegistry = await AuditRegistry.deploy(admin.address);
  await auditRegistry.waitForDeployment();
  console.log("✅ AuditRegistry:", await auditRegistry.getAddress());

  // Deploy Carbon Credit NFT
  const CarbonCreditNFT = await hre.ethers.getContractFactory("CarbonCreditNFT");
  const nft = await CarbonCreditNFT.deploy("CarbonCredits", "CCNFT", admin.address);
  await nft.waitForDeployment();
  console.log("✅ CarbonCreditNFT:", await nft.getAddress());

  // Deploy Impact Token
  const ImpactToken = await hre.ethers.getContractFactory("ImpactToken");
  const token = await ImpactToken.deploy("ImpactToken", "IMPACT", admin.address);
  await token.waitForDeployment();
  console.log("✅ ImpactToken:", await token.getAddress());

  // Deploy DAO
  const ClimateDAO = await hre.ethers.getContractFactory("ClimateDAO");
  const dao = await ClimateDAO.deploy(
    admin.address,
    auditRegistry,
    nft,
    token
  );
  await dao.waitForDeployment();
  console.log("✅ ClimateDAO:", await dao.getAddress());

  console.log("\n🚀 Deployment Complete ✅");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
