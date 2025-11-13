// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EncryptedRandomSelector is SepoliaConfig, Ownable {
    // Encrypted storage for participant handles
    mapping(uint256 => euint32) private encryptedHandles;
    mapping(uint256 => bool) private handleExists;

    // Selection state
    euint32 private encryptedWinnerIndex;
    bool private selectionReady;
    uint256 private participantCount;

    // Events
    event ParticipantEnrolled(uint256 indexed participantId, euint32 encryptedHandle);
    event SelectionGenerated(euint32 encryptedWinner);
    event RoundReset();

    /// @notice Enroll a participant with encrypted identity handle
    function enrollParticipant(
        externalEuint32 encryptedHandle,
        bytes calldata inputProof
    ) external onlyOwner {
        euint32 handle = FHE.fromExternal(encryptedHandle, inputProof);
        uint256 participantId = participantCount++;

        encryptedHandles[participantId] = handle;
        handleExists[participantId] = true;

        FHE.allowThis(handle);
        emit ParticipantEnrolled(participantId, handle);
    }

    /// @notice Generate encrypted random winner index
    function generateEncryptedSelection() external onlyOwner {
        require(participantCount > 0, "NoCandidates");

        // Generate encrypted random index using FHE operations
        // In production, this would use a VRF or similar entropy source
        euint32 randomIndex = FHE.asEuint32(uint32(block.timestamp % participantCount));

        encryptedWinnerIndex = randomIndex;
        selectionReady = true;

        FHE.allowThis(encryptedWinnerIndex);
        emit SelectionGenerated(encryptedWinnerIndex);
    }

    /// @notice Get encrypted winner handle for decryption
    function getEncryptedWinner() external view returns (euint32) {
        require(selectionReady, "DecryptionNotReady");
        return encryptedHandles[FHE.decrypt(encryptedWinnerIndex)];
    }

    /// @notice Reset round for new selection
    function resetRound() external onlyOwner {
        for (uint256 i = 0; i < participantCount; i++) {
            delete encryptedHandles[i];
            delete handleExists[i];
        }
        participantCount = 0;
        selectionReady = false;
        delete encryptedWinnerIndex;

        emit RoundReset();
    }

    /// @notice Get participant count
    function getParticipantCount() external view returns (uint256) {
        return participantCount;
    }

    /// @notice Check if selection is ready
    function isSelectionReady() external view returns (bool) {
        return selectionReady;
    }
}
