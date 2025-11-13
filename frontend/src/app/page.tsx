import { EncryptedSelector } from '../components/EncryptedSelector';

export default function Home() {
  const fhevmConfig = {
    network: 'sepolia' as const,
    contractAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    fhevmEndpoint: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Encrypted Random Selector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A privacy-preserving lottery system built on FHEVM that enables secure random selection
            without revealing participant identities. All submissions are encrypted end-to-end.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-600 border border-blue-200">
              🔐 End-to-End Encrypted
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-green-600 border border-green-200">
              ⚡ FHEVM Powered
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-purple-600 border border-purple-200">
              🎯 Privacy First
            </div>
          </div>
        </div>

        <EncryptedSelector config={fhevmConfig} />

        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Encrypted Enrollment</h3>
                <p className="text-gray-600 text-sm">
                  Participants submit their identities encrypted with FHEVM client.
                  Only ciphertexts are stored on-chain.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Random Selection</h3>
                <p className="text-gray-600 text-sm">
                  Contract owner generates encrypted random index.
                  Selection happens fully on-chain under FHE.
                </p>
              </div>
              <div className="text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Controlled Disclosure</h3>
                <p className="text-gray-600 text-sm">
                  Winner is decrypted locally or via oracle.
                  Participants verify outcome without exposing identities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Deploy</h2>
            <p className="mb-6">
              This application is configured for Sepolia testnet and ready for production deployment.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">Sepolia Testnet</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">FHEVM Compatible</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
