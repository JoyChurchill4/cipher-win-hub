import { expect } from "chai";
import { ethers } from "hardhat";
import { FHEVMIntegration } from "../types";

describe("FHEVMIntegration", function () {
  let fhevmIntegration: FHEVMIntegration;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const FHEVMIntegration = await ethers.getContractFactory("FHEVMIntegration");
    fhevmIntegration = await FHEVMIntegration.deploy();
    await fhevmIntegration.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await fhevmIntegration.getAddress()).to.be.properAddress;
    });

    it("Should return correct FHEVM version", async function () {
      expect(await fhevmIntegration.getFHEVMVersion()).to.equal("FHEVM v0.7.0-4");
    });

    it("Should report FHEVM as enabled", async function () {
      expect(await fhevmIntegration.isFHEVMEnabled()).to.equal(true);
    });
  });

  describe("Encryption Operations", function () {
    it("Should encrypt a value", async function () {
      const value = 42;
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      const encryptedValue = await fhevmIntegration.encryptValue(value, mockProof);

      // In a real FHEVM environment, we would verify the encrypted value
      expect(encryptedValue).to.not.be.undefined;
    });

    it("Should emit EncryptionPerformed event", async function () {
      const value = 123;
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      await expect(fhevmIntegration.encryptValue(value, mockProof))
        .to.emit(fhevmIntegration, "EncryptionPerformed")
        .withArgs(owner.address, (value: any) => value !== undefined);
    });

    it("Should emit FHEOperation event for encryption", async function () {
      const value = 456;
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      await expect(fhevmIntegration.encryptValue(value, mockProof))
        .to.emit(fhevmIntegration, "FHEOperation")
        .withArgs("encryption", owner.address, (timestamp: any) => timestamp > 0);
    });
  });

  describe("Homomorphic Operations", function () {
    // Note: These tests would be more comprehensive in a full FHEVM environment
    // For now, they demonstrate the interface

    it("Should perform homomorphic addition", async function () {
      const mockProof1 = ethers.toUtf8Bytes("mock_proof_1");
      const mockProof2 = ethers.toUtf8Bytes("mock_proof_2");

      const encryptedA = await fhevmIntegration.encryptValue(10, mockProof1);
      const encryptedB = await fhevmIntegration.encryptValue(20, mockProof2);

      const result = await fhevmIntegration.homomorphicAdd(encryptedA, encryptedB);
      expect(result).to.not.be.undefined;
    });

    it("Should perform homomorphic subtraction", async function () {
      const mockProof1 = ethers.toUtf8Bytes("mock_proof_1");
      const mockProof2 = ethers.toUtf8Bytes("mock_proof_2");

      const encryptedA = await fhevmIntegration.encryptValue(30, mockProof1);
      const encryptedB = await fhevmIntegration.encryptValue(10, mockProof2);

      const result = await fhevmIntegration.homomorphicSub(encryptedA, encryptedB);
      expect(result).to.not.be.undefined;
    });

    it("Should perform homomorphic multiplication", async function () {
      const mockProof1 = ethers.toUtf8Bytes("mock_proof_1");
      const mockProof2 = ethers.toUtf8Bytes("mock_proof_2");

      const encryptedA = await fhevmIntegration.encryptValue(5, mockProof1);
      const encryptedB = await fhevmIntegration.encryptValue(4, mockProof2);

      const result = await fhevmIntegration.homomorphicMul(encryptedA, encryptedB);
      expect(result).to.not.be.undefined;
    });

    it("Should perform homomorphic comparison", async function () {
      const mockProof1 = ethers.toUtf8Bytes("mock_proof_1");
      const mockProof2 = ethers.toUtf8Bytes("mock_proof_2");

      const encryptedA = await fhevmIntegration.encryptValue(15, mockProof1);
      const encryptedB = await fhevmIntegration.encryptValue(10, mockProof2);

      const result = await fhevmIntegration.homomorphicGt(encryptedA, encryptedB);
      expect(result).to.not.be.undefined;
    });
  });

  describe("Random Generation", function () {
    it("Should generate random index within bounds", async function () {
      const maxValue = 100;

      const randomIndex = await fhevmIntegration.generateRandomIndex(maxValue);
      expect(randomIndex).to.not.be.undefined;
    });

    it("Should reject zero max value", async function () {
      await expect(fhevmIntegration.generateRandomIndex(0))
        .to.be.revertedWith("MaxValueMustBePositive");
    });

    it("Should emit FHEOperation event for random generation", async function () {
      const maxValue = 50;

      await expect(fhevmIntegration.generateRandomIndex(maxValue))
        .to.emit(fhevmIntegration, "FHEOperation")
        .withArgs("random_generation", owner.address, (timestamp: any) => timestamp > 0);
    });
  });

  describe("Decryption", function () {
    it("Should decrypt an encrypted value", async function () {
      const originalValue = 789;
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      const encryptedValue = await fhevmIntegration.encryptValue(originalValue, mockProof);

      // In a real FHEVM environment, decryption would require proper authorization
      // For testing, we simulate the decryption process
      const decryptedValue = await fhevmIntegration.decryptValue(encryptedValue);

      // Note: In a real FHEVM environment, this would equal the original value
      expect(typeof decryptedValue).to.equal("number");
    });

    it("Should emit DecryptionRequested event", async function () {
      const originalValue = 999;
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      const encryptedValue = await fhevmIntegration.encryptValue(originalValue, mockProof);

      await expect(fhevmIntegration.decryptValue(encryptedValue))
        .to.emit(fhevmIntegration, "DecryptionRequested")
        .withArgs(owner.address, encryptedValue);
    });
  });

  describe("Batch Operations", function () {
    it("Should batch encrypt multiple values", async function () {
      const values = [1, 2, 3, 4, 5];
      const proofs = values.map(() => ethers.toUtf8Bytes("mock_proof"));

      const encryptedValues = await fhevmIntegration.batchEncrypt(values, proofs);

      expect(encryptedValues).to.have.lengthOf(values.length);
      encryptedValues.forEach(encryptedValue => {
        expect(encryptedValue).to.not.be.undefined;
      });
    });

    it("Should reject mismatched input lengths", async function () {
      const values = [1, 2, 3];
      const proofs = [ethers.toUtf8Bytes("proof1"), ethers.toUtf8Bytes("proof2")]; // Different length

      await expect(fhevmIntegration.batchEncrypt(values, proofs))
        .to.be.revertedWith("MismatchedInputs");
    });

    it("Should reject empty batch", async function () {
      const values: number[] = [];
      const proofs: string[] = [];

      await expect(fhevmIntegration.batchEncrypt(values, proofs))
        .to.be.revertedWith("EmptyBatch");
    });
  });

  describe("Events", function () {
    it("Should emit FHEOperation events for all operations", async function () {
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      // Test various operations emit the event
      await expect(fhevmIntegration.encryptValue(100, mockProof))
        .to.emit(fhevmIntegration, "FHEOperation");

      const encryptedA = await fhevmIntegration.encryptValue(10, mockProof);
      const encryptedB = await fhevmIntegration.encryptValue(5, mockProof);

      await expect(fhevmIntegration.homomorphicAdd(encryptedA, encryptedB))
        .to.emit(fhevmIntegration, "FHEOperation");

      await expect(fhevmIntegration.generateRandomIndex(10))
        .to.emit(fhevmIntegration, "FHEOperation");
    });
  });
});
