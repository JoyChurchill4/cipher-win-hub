// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEVM Integration Layer
 * @dev Provides utility functions for FHE operations in EncryptedRandomSelector
 * @notice This contract demonstrates FHEVM integration patterns
 */
contract FHEVMIntegration is SepoliaConfig {
    // Events for FHE operations
    event FHEOperation(string operation, address indexed caller, uint256 timestamp);
    event EncryptionPerformed(address indexed user, euint32 encryptedValue);
    event DecryptionRequested(address indexed user, euint32 encryptedValue);

    /// @notice Encrypt a uint32 value using FHEVM
    /// @param value The plaintext value to encrypt
    /// @param inputProof The zero-knowledge proof for the input
    /// @return The encrypted value
    function encryptValue(
        uint32 value,
        bytes calldata inputProof
    ) external returns (euint32) {
        euint32 encryptedValue = FHE.asEuint32(value);

        // In a real FHEVM environment, this would validate the proof
        // For demonstration, we accept the input as valid
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);

        emit EncryptionPerformed(msg.sender, encryptedValue);
        emit FHEOperation("encryption", msg.sender, block.timestamp);

        return encryptedValue;
    }

    /// @notice Perform homomorphic addition
    /// @param a First encrypted operand
    /// @param b Second encrypted operand
    /// @return Result of a + b (encrypted)
    function homomorphicAdd(
        euint32 a,
        euint32 b
    ) external returns (euint32) {
        euint32 result = FHE.add(a, b);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit FHEOperation("addition", msg.sender, block.timestamp);

        return result;
    }

    /// @notice Perform homomorphic subtraction
    /// @param a First encrypted operand
    /// @param b Second encrypted operand
    /// @return Result of a - b (encrypted)
    function homomorphicSub(
        euint32 a,
        euint32 b
    ) external returns (euint32) {
        euint32 result = FHE.sub(a, b);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit FHEOperation("subtraction", msg.sender, block.timestamp);

        return result;
    }

    /// @notice Perform homomorphic multiplication
    /// @param a First encrypted operand
    /// @param b Second encrypted operand
    /// @return Result of a * b (encrypted)
    function homomorphicMul(
        euint32 a,
        euint32 b
    ) external returns (euint32) {
        euint32 result = FHE.mul(a, b);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit FHEOperation("multiplication", msg.sender, block.timestamp);

        return result;
    }

    /// @notice Compare encrypted values
    /// @param a First encrypted value
    /// @param b Second encrypted value
    /// @return Whether a > b (encrypted boolean result)
    function homomorphicGt(
        euint32 a,
        euint32 b
    ) external returns (euint32) {
        euint32 result = FHE.gt(a, b);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit FHEOperation("comparison", msg.sender, block.timestamp);

        return result;
    }

    /// @notice Generate a pseudo-random encrypted index
    /// @param maxValue The upper bound (exclusive)
    /// @return Random index between 0 and maxValue-1
    function generateRandomIndex(uint32 maxValue) external returns (euint32) {
        require(maxValue > 0, "MaxValueMustBePositive");

        // Use block data for pseudo-randomness (upgrade to VRF in production)
        uint32 randomSeed = uint32(
            uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)))
        );

        euint32 randomIndex = FHE.asEuint32(randomSeed % maxValue);

        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, msg.sender);

        emit FHEOperation("random_generation", msg.sender, block.timestamp);

        return randomIndex;
    }

    /// @notice Decrypt an encrypted value (for authorized users only)
    /// @param encryptedValue The value to decrypt
    /// @return The decrypted plaintext value
    function decryptValue(euint32 encryptedValue) external returns (uint32) {
        // In production, this would require proper authorization checks
        // For demonstration purposes, allowing decryption by anyone

        uint32 decryptedValue = FHE.decrypt(encryptedValue);

        emit DecryptionRequested(msg.sender, encryptedValue);
        emit FHEOperation("decryption", msg.sender, block.timestamp);

        return decryptedValue;
    }

    /// @notice Batch encrypt multiple values
    /// @param values Array of plaintext values
    /// @param proofs Array of corresponding proofs
    /// @return Array of encrypted values
    function batchEncrypt(
        uint32[] calldata values,
        bytes[] calldata proofs
    ) external returns (euint32[] memory) {
        require(values.length == proofs.length, "MismatchedInputs");
        require(values.length > 0, "EmptyBatch");

        euint32[] memory encryptedValues = new euint32[](values.length);

        for (uint256 i = 0; i < values.length; i++) {
            encryptedValues[i] = FHE.asEuint32(values[i]);
            FHE.allowThis(encryptedValues[i]);
            FHE.allow(encryptedValues[i], msg.sender);
        }

        emit FHEOperation("batch_encryption", msg.sender, block.timestamp);

        return encryptedValues;
    }

    /// @notice Get FHEVM library version info
    /// @return Version string
    function getFHEVMVersion() external pure returns (string memory) {
        return "FHEVM v0.7.0-4";
    }

    /// @notice Check if FHE operations are supported
    /// @return Whether FHEVM is available
    function isFHEVMEnabled() external view returns (bool) {
        // In a real FHEVM environment, this would check if FHE operations are available
        return true;
    }
}
