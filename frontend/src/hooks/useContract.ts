import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ContractFunctions, FHEVMConfig, SelectionResult, EncryptedParticipant } from '../types/fhevm';

export const useContract = (config: FHEVMConfig) => {
  const [contract, setContract] = useState<ContractFunctions | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [selectionResult, setSelectionResult] = useState<SelectionResult | null>(null);
  const [participants, setParticipants] = useState<EncryptedParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialize contract connection
  const initializeContract = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // In a real application, you would import the contract ABI and create a contract instance
      // For demonstration, we'll create a mock contract interface
      const mockContract: ContractFunctions = {
        enrollParticipant: async (encryptedHandle: string, proof: string) => {
          // Mock implementation
          console.log('Enrolling participant with:', { encryptedHandle, proof });
          setParticipantCount(prev => prev + 1);
        },
        generateEncryptedSelection: async () => {
          // Mock implementation
          console.log('Generating encrypted selection');
          setSelectionResult({
            winnerId: Math.floor(Math.random() * participantCount),
            isReady: true,
            canDecrypt: true,
          });
        },
        getEncryptedWinner: async () => {
          // Mock implementation
          return 'encrypted_winner_data';
        },
        resetRound: async () => {
          // Mock implementation
          console.log('Resetting round');
          setParticipants([]);
          setParticipantCount(0);
          setSelectionResult(null);
        },
        getParticipantCount: async () => {
          return participantCount;
        },
        isSelectionReady: async () => {
          return selectionResult?.isReady || false;
        },
      };

      setContract(mockContract);
      setAccount(accounts[0]);
      setIsConnected(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to contract');
      setIsConnected(false);
    }
  }, [participantCount, selectionResult]);

  // Enroll a participant
  const enrollParticipant = useCallback(async (participantId: number) => {
    if (!contract) return;

    setIsLoading(true);
    setError('');

    try {
      // In real FHEVM, this would encrypt the participant ID
      const encryptedHandle = `encrypted_${participantId}`;
      const proof = `proof_${participantId}`;

      await contract.enrollParticipant(encryptedHandle, proof);

      const newParticipant: EncryptedParticipant = {
        id: participantId,
        encryptedHandle,
        enrolledAt: Date.now(),
      };

      setParticipants(prev => [...prev, newParticipant]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll participant');
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Generate random selection
  const generateSelection = useCallback(async () => {
    if (!contract) return;

    setIsLoading(true);
    setError('');

    try {
      await contract.generateEncryptedSelection();

      // Mock result
      const winnerId = Math.floor(Math.random() * participants.length);
      setSelectionResult({
        winnerId,
        isReady: true,
        canDecrypt: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate selection');
    } finally {
      setIsLoading(false);
    }
  }, [contract, participants.length]);

  // Reset round
  const resetRound = useCallback(async () => {
    if (!contract) return;

    setIsLoading(true);
    setError('');

    try {
      await contract.resetRound();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset round');
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Update participant count
  const updateParticipantCount = useCallback(async () => {
    if (!contract) return;

    try {
      const count = await contract.getParticipantCount();
      setParticipantCount(count);
    } catch (err) {
      console.error('Failed to get participant count:', err);
    }
  }, [contract]);

  // Initialize on mount
  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
          setIsConnected(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return {
    contract,
    isConnected,
    account,
    participantCount,
    selectionResult,
    participants,
    isLoading,
    error,
    enrollParticipant,
    generateSelection,
    resetRound,
    updateParticipantCount,
    initializeContract,
  };
};
