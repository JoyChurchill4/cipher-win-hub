import { task } from "hardhat/config";
import { EncryptedRandomSelector } from "../types";

task("encrypted-selector:deploy", "Deploy EncryptedRandomSelector contract")
  .setAction(async (_, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    console.log("Deploying EncryptedRandomSelector with account:", deployer);

    const deployment = await deploy("EncryptedRandomSelector", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: 1,
    });

    console.log(`EncryptedRandomSelector deployed at: ${deployment.address}`);

    // Save deployment info
    const fs = require("fs");
    const deploymentInfo = {
      address: deployment.address,
      network: hre.network.name,
      deployer: deployer,
      timestamp: new Date().toISOString(),
      blockNumber: deployment.receipt?.blockNumber,
    };

    const deploymentPath = `./deployments/${hre.network.name}`;
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    fs.writeFileSync(
      `${deploymentPath}/EncryptedRandomSelector-deployment.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`Deployment info saved to: ${deploymentPath}/EncryptedRandomSelector-deployment.json`);
  });

task("encrypted-selector:enroll", "Enroll a participant (for testing)")
  .addParam("id", "Participant ID to enroll")
  .setAction(async (taskArgs, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const encryptedSelector = await hre.ethers.getContract<EncryptedRandomSelector>(
      "EncryptedRandomSelector",
      deployer
    );

    console.log(`Enrolling participant ${taskArgs.id}...`);

    // In a real FHEVM environment, this would encrypt the participant ID
    // For now, we'll simulate with mock data
    const mockEncryptedHandle = hre.ethers.toUtf8Bytes(`encrypted_handle_${taskArgs.id}`);
    const mockProof = hre.ethers.toUtf8Bytes("mock_proof");

    try {
      const tx = await encryptedSelector.enrollParticipant(mockEncryptedHandle, mockProof);
      await tx.wait();

      console.log(`Participant ${taskArgs.id} enrolled successfully`);
      console.log(`Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Failed to enroll participant:", error);
    }
  });

task("encrypted-selector:select", "Generate encrypted random selection")
  .setAction(async (_, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const encryptedSelector = await hre.ethers.getContract<EncryptedRandomSelector>(
      "EncryptedRandomSelector",
      deployer
    );

    console.log("Generating encrypted random selection...");

    try {
      const tx = await encryptedSelector.generateEncryptedSelection();
      await tx.wait();

      console.log("Selection generated successfully");
      console.log(`Transaction hash: ${tx.hash}`);

      const isReady = await encryptedSelector.isSelectionReady();
      const participantCount = await encryptedSelector.getParticipantCount();

      console.log(`Selection ready: ${isReady}`);
      console.log(`Total participants: ${participantCount}`);
    } catch (error) {
      console.error("Failed to generate selection:", error);
    }
  });

task("encrypted-selector:reset", "Reset the selection round")
  .setAction(async (_, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const encryptedSelector = await hre.ethers.getContract<EncryptedRandomSelector>(
      "EncryptedRandomSelector",
      deployer
    );

    console.log("Resetting selection round...");

    try {
      const tx = await encryptedSelector.resetRound();
      await tx.wait();

      console.log("Round reset successfully");
      console.log(`Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Failed to reset round:", error);
    }
  });

task("encrypted-selector:info", "Get contract information")
  .setAction(async (_, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const encryptedSelector = await hre.ethers.getContract<EncryptedRandomSelector>(
      "EncryptedRandomSelector",
      deployer
    );

    try {
      const participantCount = await encryptedSelector.getParticipantCount();
      const isReady = await encryptedSelector.isSelectionReady();
      const owner = await encryptedSelector.owner();

      console.log("=== EncryptedRandomSelector Info ===");
      console.log(`Contract address: ${await encryptedSelector.getAddress()}`);
      console.log(`Owner: ${owner}`);
      console.log(`Network: ${hre.network.name}`);
      console.log(`Participant count: ${participantCount}`);
      console.log(`Selection ready: ${isReady}`);
      console.log(`Deployer: ${deployer}`);
    } catch (error) {
      console.error("Failed to get contract info:", error);
    }
  });
