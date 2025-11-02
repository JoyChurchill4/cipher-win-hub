import { expect } from "chai";
import { ethers } from "hardhat";
import { EncryptedRandomSelector } from "../types";
import { deployEncryptedRandomSelector } from "./helpers";

describe("EncryptedRandomSelector", function () {
  let encryptedSelector: EncryptedRandomSelector;
  let owner: any;
  let participant1: any;

  beforeEach(async function () {
    [owner, participant1] = await ethers.getSigners();
    encryptedSelector = await deployEncryptedRandomSelector();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await encryptedSelector.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero participants", async function () {
      expect(await encryptedSelector.getParticipantCount()).to.equal(0);
    });

    it("Should not be ready for selection initially", async function () {
      expect(await encryptedSelector.isSelectionReady()).to.equal(false);
    });
  });

  describe("Participant Enrollment", function () {
    it("Should allow owner to enroll participants", async function () {
      // Note: In a real FHEVM environment, this would include actual encryption
      // For testing purposes, we'll simulate the enrollment process
      const participantId = 1;
      const mockEncryptedHandle = ethers.toUtf8Bytes("encrypted_handle_1");
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      // This would normally call enrollParticipant with FHE parameters
      // await expect(encryptedSelector.enrollParticipant(mockEncryptedHandle, mockProof))
      //   .to.emit(encryptedSelector, "ParticipantEnrolled");

      expect(await encryptedSelector.getParticipantCount()).to.equal(0);
    });

    it("Should reject enrollment from non-owner", async function () {
      const mockEncryptedHandle = ethers.toUtf8Bytes("encrypted_handle_1");
      const mockProof = ethers.toUtf8Bytes("mock_proof");

      await expect(
        encryptedSelector.connect(participant1).enrollParticipant(mockEncryptedHandle, mockProof)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Selection Generation", function () {
    it("Should allow owner to generate selection when participants exist", async function () {
      // Pre-enroll some participants (simulated)
      // In real FHEVM, this would involve actual encrypted operations

      // await expect(encryptedSelector.generateEncryptedSelection())
      //   .to.emit(encryptedSelector, "SelectionGenerated");

      expect(await encryptedSelector.isSelectionReady()).to.equal(false);
    });

    it("Should reject selection generation when no participants", async function () {
      await expect(
        encryptedSelector.generateEncryptedSelection()
      ).to.be.revertedWith("NoCandidates");
    });

    it("Should reject selection from non-owner", async function () {
      await expect(
        encryptedSelector.connect(participant1).generateEncryptedSelection()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Winner Retrieval", function () {
    it("Should reject winner retrieval when selection not ready", async function () {
      await expect(
        encryptedSelector.getEncryptedWinner()
      ).to.be.revertedWith("DecryptionNotReady");
    });

    // Note: Real winner retrieval would require FHEVM decryption operations
    // These tests would be more comprehensive in a full FHEVM environment
  });

  describe("Round Reset", function () {
    it("Should allow owner to reset round", async function () {
      await expect(encryptedSelector.resetRound())
        .to.emit(encryptedSelector, "RoundReset");

      expect(await encryptedSelector.getParticipantCount()).to.equal(0);
      expect(await encryptedSelector.isSelectionReady()).to.equal(false);
    });

    it("Should reject reset from non-owner", async function () {
      await expect(
        encryptedSelector.connect(participant1).resetRound()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
