'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FHEVMConfig, EncryptedParticipant, SelectionResult } from '../types/fhevm';

interface EncryptedSelectorProps {
  config: FHEVMConfig;
}

export const EncryptedSelector: React.FC<EncryptedSelectorProps> = ({ config }) => {
  const [participants, setParticipants] = useState<EncryptedParticipant[]>([]);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [selectionResult, setSelectionResult] = useState<SelectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newParticipantId, setNewParticipantId] = useState('');

  // Initialize FHEVM connection
  useEffect(() => {
    initializeFHEVM();
  }, []);

  const initializeFHEVM = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // FHEVM initialization would go here
        updateParticipantCount();
      }
    } catch (error) {
      console.error('Failed to initialize FHEVM:', error);
    }
  };

  const updateParticipantCount = async () => {
    // Contract interaction would go here
    setParticipantCount(0);
  };

  const enrollParticipant = async () => {
    if (!newParticipantId) return;

    setIsLoading(true);
    try {
      // FHE encryption and contract call would go here
      const participant: EncryptedParticipant = {
        id: parseInt(newParticipantId),
        encryptedHandle: 'encrypted_' + newParticipantId,
        enrolledAt: Date.now(),
      };

      setParticipants([...participants, participant]);
      setParticipantCount(participants.length + 1);
      setNewParticipantId('');
    } catch (error) {
      console.error('Failed to enroll participant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSelection = async () => {
    setIsLoading(true);
    try {
      // Contract call to generate encrypted selection would go here
      const result: SelectionResult = {
        winnerId: Math.floor(Math.random() * participants.length),
        isReady: true,
        canDecrypt: true,
      };
      setSelectionResult(result);
    } catch (error) {
      console.error('Failed to generate selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRound = async () => {
    setParticipants([]);
    setParticipantCount(0);
    setSelectionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Encrypted Random Selector
      </h1>

      {/* Participant Enrollment */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Participant Enrollment</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={newParticipantId}
            onChange={(e) => setNewParticipantId(e.target.value)}
            placeholder="Participant ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={enrollParticipant}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Enrolling...' : 'Enroll Participant'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Registered Candidates: {participantCount}
        </p>
      </div>

      {/* Selection Console */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Encrypted Selection Console</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            placeholder="Selection index"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            readOnly
          />
          <button
            onClick={generateSelection}
            disabled={isLoading || participantCount === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Random'}
          </button>
        </div>
        <button
          onClick={resetRound}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reset Round
        </button>
      </div>

      {/* Winner Reveal */}
      {selectionResult && (
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Winner Reveal</h2>
          <p className="text-lg">
            Winner ID: <span className="font-bold text-green-600">{selectionResult.winnerId}</span>
          </p>
          <p className="text-sm text-green-700 mt-2">
            Selection is ready for decryption and audit.
          </p>
        </div>
      )}

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Enrolled Participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <div key={participant.id} className="p-4 bg-white rounded border">
                <p className="font-semibold">ID: {participant.id}</p>
                <p className="text-sm text-gray-600">
                  Enrolled: {new Date(participant.enrolledAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
