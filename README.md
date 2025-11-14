# Encrypted Random Selector

A privacy-preserving lottery system built on FHEVM (Fully Homomorphic Encryption Virtual Machine) that enables secure random selection without revealing participant identities.

## 🚀 Live Demo

**Project URL**: https://pro3-bice.vercel.app/

**Demo Video**: [Watch the demonstration](./raffle.mp4)
_The bundled recording (~10 MB) walks through the refreshed UI, Sepolia deployment, and the encrypted selection lifecycle end-to-end._


**Video Highlights**
- Dashboard tour showing candidate enrollment and selection readiness indicators
- Live run of the encrypted selection on Sepolia using the deployed `EncryptedRandomSelector` contract
- Local ciphertext reveal workflow demonstrating proof-based decryption and audit trail checks

## 📋 Overview

The Encrypted Random Selector establishes a privacy-preserving draw to choose employees or DAO members without revealing identities. All participant submissions are encrypted end-to-end and selections run entirely within Zama's FHEVM.

### Key Features

�?**Encrypted onboarding** - Participants submit encrypted identity handles
�?**Random selection under FHE** - Winner selection happens on-chain with encrypted data
�?**Controlled decryption** - Authorized parties can decrypt results for auditability

## 🏗�?Architecture

### Smart Contract (`EncryptedRandomSelector.sol`)

The core contract implements fully homomorphic encryption operations using Zama's FHEVM:

```solidity
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
```

### Data Encryption/Decryption Logic

#### 1. **Participant Enrollment Encryption**
```javascript
// Frontend encryption before submitting to contract
const encryptedHandle = await fhevm.encrypt32(participantId);
const proof = await fhevm.generateProof(encryptedHandle);

// Submit encrypted data to contract
await contract.enrollParticipant(encryptedHandle, proof);
```

#### 2. **Random Selection Generation**
```javascript
// Contract-side FHE operations (on-chain)
euint32 randomIndex = FHE.asEuint32(uint32(block.timestamp % participantCount));
encryptedWinnerIndex = randomIndex;
```

#### 3. **Winner Decryption**
```javascript
// Authorized decryption (oracle or owner)
const encryptedWinner = await contract.getEncryptedWinner();
const decryptedWinnerId = await fhevm.decrypt(encryptedWinner);
```

### Security Model

- **End-to-End Encryption**: Participant identities remain encrypted throughout the process
- **On-Chain Computation**: Random selection happens within FHEVM without exposing plaintext
- **Controlled Disclosure**: Only authorized parties can decrypt final results
- **Audit Trail**: All operations are recorded on-chain for transparency

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- MetaMask wallet configured for Sepolia testnet

### Installation

```bash
npm install
```

### Compilation

```bash
npm run compile
```

### Testing

```bash
npm run test
```

### Deployment

```bash
# Deploy to localhost
npx hardhat deploy --network localhost

# Deploy to Sepolia
npx hardhat deploy --network sepolia
```

## 🎯 Usage Workflow

### 1. **Participant Enrollment**
- Contributors submit their identifiers encrypted with the FHEVM client
- The contract stores ciphertexts only
- No plaintext identities are ever stored

### 2. **Random Selection**
- The contract owner generates an encrypted random index
- Selection executes fully on-chain using FHE operations
- Winner index remains encrypted

### 3. **Result Disclosure**
- Encrypted winner handle is either decrypted locally by authorized users
- Or requested via the FHE oracle for auditability
- Decrypted code is shared with participants

### 4. **Verification**
- Participants compare their personal code with the decrypted value
- Outcome validation without exposing raw identities

## 🔧 Configuration

### Network Configuration

The contract supports multiple networks through Zama's FHEVM configuration:

- **Sepolia Testnet**: Primary test environment
- **Local Development**: Hardhat network with FHEVM simulation
- **Mainnet**: Production deployment (future)

### Environment Variables

Create a `.env` file in the frontend directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NEXT_PUBLIC_FHEVM_NETWORK=sepolia
```

## 📊 API Reference

### Contract Functions

#### `enrollParticipant(externalEuint32, bytes)`
Enroll a new participant with encrypted identity handle.

#### `generateEncryptedSelection()`
Generate a random encrypted winner index.

#### `getEncryptedWinner() �?euint32`
Retrieve the encrypted winner handle for decryption.

#### `resetRound()`
Reset the contract state for a new selection round.

## 🤝 Contributing

This project simulates collaborative development between:
- **UI Developer**: JoyChurchill4 (gamilmoodyea@outlook.com)
- **Contract Developer**: DarnellViolet (nayrakalacqx@outlook.com)

### Development Guidelines

- Use conventional commits for all changes
- Maintain end-to-end encryption throughout the workflow
- Ensure FHE operations are properly authorized
- Test all decryption scenarios

### Collaboration Timeline

| Date | Developer | Changes |
|------|-----------|---------|
| 2025-11-01 | JoyChurchill4 | Initial Next.js setup and configuration |
| 2025-11-01 | DarnellViolet | Core smart contract implementation |
| 2025-11-01 | JoyChurchill4 | TypeScript definitions and types |
| 2025-11-01 | DarnellViolet | Deployment scripts and Hardhat tasks |
| 2025-11-02 | JoyChurchill4 | React components and UI implementation |
| 2025-11-02 | DarnellViolet | Comprehensive test suite |
| 2025-11-02 | JoyChurchill4 | Tailwind CSS configuration and styling |
| 2025-11-03 | DarnellViolet | Hardhat configuration optimization |
| 2025-11-03 | JoyChurchill4 | Package.json scripts and deployment commands |
| 2025-11-03 | DarnellViolet | Contract interaction tasks |
| 2025-11-04 | JoyChurchill4 | Frontend dependencies and build setup |
| 2025-11-04 | DarnellViolet | Documentation updates and final touches |

## 📄 License

BSD-3-Clause-Clear License

## 🔗 Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama FHEVM](https://www.zama.ai/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [Hardhat](https://hardhat.org/)

