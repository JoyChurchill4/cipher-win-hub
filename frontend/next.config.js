/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_FHEVM_NETWORK: process.env.NEXT_PUBLIC_FHEVM_NETWORK || 'sepolia',
  },
}

module.exports = nextConfig
