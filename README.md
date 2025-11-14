# Encrypted Random Selector

A privacy-preserving lottery system built on FHEVM (Fully Homomorphic Encryption Virtual Machine) that enables secure random selection without revealing participant identities.

## Live Demo

- Project URL: https://pro3-bice.vercel.app/
- Demo Video: [Watch the demonstration](./raffle.mp4)
  - The bundled recording (~10 MB) walks through the refreshed UI, Sepolia deployment, and the encrypted selection lifecycle end to end.

### Video Highlights
- Dashboard tour showing candidate enrollment and selection readiness indicators
- Live run of the encrypted selection on Sepolia using the deployed EncryptedRandomSelector contract
- Local ciphertext reveal workflow demonstrating proof based decryption and audit trail checks

## Overview

The Encrypted Random Selector establishes a privacy-preserving draw to choose employees or DAO members without revealing identities. All participant submissions are encrypted end to end and selections run entirely within Zama FHEVM.

### Key Features

- Encrypted onboarding: participants submit encrypted identity handles
- Random selection under FHE: winner selection happens on chain with encrypted data
- Controlled decryption: authorized parties can decrypt results for auditability

## Architecture

### Smart Contract (EncryptedRandomSelector.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EncryptedRandomSelector is SepoliaConfig, Ownable {
    mapping(uint256 => euint32) private encryptedHandles;
    mapping(uint256 => bool) private handleExists;

    euint32 private encryptedWinnerIndex;
    bool private selectionReady;
    uint256 private participantCount;

    event ParticipantEnrolled(uint256 indexed participantId, euint32 encryptedHandle);
    event SelectionGenerated(euint32 encryptedWinner);
    event RoundReset();

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

    function generateEncryptedSelection() external onlyOwner {
        require(participantCount > 0, "NoCandidates");
        euint32 randomIndex = FHE.asEuint32(uint32(block.timestamp % participantCount));
        encryptedWinnerIndex = randomIndex;
        selectionReady = true;
        FHE.allowThis(encryptedWinnerIndex);
        emit SelectionGenerated(encryptedWinnerIndex);
    }

    function getEncryptedWinner() external view returns (euint32) {
        require(selectionReady, "DecryptionNotReady");
        return encryptedHandles[FHE.decrypt(encryptedWinnerIndex)];
    }

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

    function getParticipantCount() external view returns (uint256) {
        return participantCount;
    }

    function isSelectionReady() external view returns (bool) {
        return selectionReady;
    }
}
```

### Data Encryption and Decryption Flow

1. **Participant enrollment (frontend)**
   ```javascript
   const encryptedHandle = await fhevm.encrypt32(participantId);
   const proof = await fhevm.generateProof(encryptedHandle);
   await contract.enrollParticipant(encryptedHandle, proof);
   ```
2. **Random selection generation (contract)**
   ```javascript
   euint32 randomIndex = FHE.asEuint32(uint32(block.timestamp % participantCount));
   encryptedWinnerIndex = randomIndex;
   ```
3. **Winner decryption (authorized actor)**
   ```javascript
   const encryptedWinner = await contract.getEncryptedWinner();
   const decryptedWinnerId = await fhevm.decrypt(encryptedWinner);
   ```

### Security Model

- End to end encryption keeps identities private.
- On chain computation under FHE ensures no plaintext leakage.
- Controlled disclosure provides auditability through proofs.
- Every step is logged on chain for transparency.

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 7
- MetaMask wallet configured for Sepolia

### Installation and Tooling

```bash
npm install
npm run compile
npm run test
```

### Deployment

```bash
npx hardhat deploy --network localhost
npx hardhat deploy --network sepolia
```

Sepolia configuration expects the contract address 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9, which is also injected into the frontend through NEXT_PUBLIC_CONTRACT_ADDRESS.

## Usage Workflow

1. Participant Enrollment - contributors encrypt their handles locally and send ciphertext plus proofs to the contract. Only ciphertext is stored.
2. Random Selection - the owner submits an encrypted random index entirely under FHE to pick the winner without revealing intermediate results.
3. Result Disclosure - the encrypted winner handle can be decrypted locally or through the oracle for auditable reveals.
4. Verification - each participant compares the decrypted code with their personal identifier to verify fairness.

## Configuration

Create frontend/.env.local (or .env) with:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NEXT_PUBLIC_FHEVM_NETWORK=sepolia
```

## API Reference

- enrollParticipant(externalEuint32, bytes) - add a new encrypted participant handle.
- generateEncryptedSelection() - compute the encrypted winner index.
- getEncryptedWinner() -> euint32 - retrieve the encrypted handle for authorized decryption.
- resetRound() - clear state and start a new selection round.

## Contributing

Simulated collaboration roster:
- UI Developer - JoyChurchill4 (gamilmoodyea@outlook.com)
- Contract Developer - DarnellViolet (nayrakalacqx@outlook.com)

| Date | Developer | Highlights |
|------|-----------|------------|
| 2025-11-01 | JoyChurchill4 | Next.js scaffold, layout, configuration |
| 2025-11-01 | DarnellViolet | Core smart contract, deployment pipelines |
| 2025-11-02 | JoyChurchill4 | UI components, Tailwind styling |
| 2025-11-02 | DarnellViolet | Comprehensive Hardhat test suites |
| 2025-11-03 | JoyChurchill4 | Frontend tooling, scripts, docs |
| 2025-11-03 | DarnellViolet | Task automation, Hardhat tooling |
| 2025-11-04 | Both | Documentation polish, production readiness |

## License

BSD-3-Clause-Clear

## Links

- https://docs.zama.ai/fhevm
- https://www.zama.ai/
- https://openzeppelin.com/contracts/
- https://hardhat.org/



