import { ethers } from "hardhat";
import { EncryptedRandomSelector } from "../types";

export async function deployEncryptedRandomSelector(): Promise<EncryptedRandomSelector> {
  const EncryptedRandomSelector = await ethers.getContractFactory("EncryptedRandomSelector");
  const encryptedSelector = await EncryptedRandomSelector.deploy();
  await encryptedSelector.waitForDeployment();
  return encryptedSelector;
}

export async function enrollMockParticipants(
  contract: EncryptedRandomSelector,
  count: number
): Promise<void> {
  for (let i = 0; i < count; i++) {
    // In a real FHEVM environment, this would encrypt the participant ID
    const mockEncryptedHandle = ethers.toUtf8Bytes(`encrypted_handle_${i}`);
    const mockProof = ethers.toUtf8Bytes("mock_proof");

    await contract.enrollParticipant(mockEncryptedHandle, mockProof);
  }
}

export async function setupParticipantsAndGenerateSelection(
  contract: EncryptedRandomSelector,
  participantCount: number
): Promise<void> {
  // Enroll participants
  await enrollMockParticipants(contract, participantCount);

  // Generate selection
  await contract.generateEncryptedSelection();
}

export function generateMockEncryptedData(value: string): {
  encryptedData: string;
  proof: string;
} {
  // In a real FHEVM environment, this would perform actual encryption
  return {
    encryptedData: `encrypted_${value}`,
    proof: `proof_${value}`,
  };
}

export async function mineBlocks(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await ethers.provider.send("evm_mine", []);
  }
}

export async function increaseTime(seconds: number): Promise<void> {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}
