export interface FHEVMConfig {
  network: 'sepolia' | 'localhost' | 'mainnet';
  contractAddress: string;
  fhevmEndpoint: string;
}

export interface EncryptedParticipant {
  id: number;
  encryptedHandle: string;
  enrolledAt: number;
}

export interface SelectionResult {
  winnerId: number;
  isReady: boolean;
  canDecrypt: boolean;
}

export interface FHEVMInstance {
  encrypt32: (value: number) => Promise<string>;
  decrypt: (encryptedValue: string) => Promise<number>;
  generateProof: (encryptedValue: string) => Promise<string>;
  verifyProof: (proof: string) => Promise<boolean>;
}

export interface ContractFunctions {
  enrollParticipant: (encryptedHandle: string, proof: string) => Promise<void>;
  generateEncryptedSelection: () => Promise<void>;
  getEncryptedWinner: () => Promise<string>;
  resetRound: () => Promise<void>;
  getParticipantCount: () => Promise<number>;
  isSelectionReady: () => Promise<boolean>;
}
