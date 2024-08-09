import { mainnet, sepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''

const metadata = {
  name: 'VidTv',
  description: 'Stream video directly from the Sia blockchain',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = [mainnet, sepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: true,
    socials: ['google', 'x', 'apple', 'github', 'discord', 'facebook'],
    showWallets: false,
    walletFeatures: true,
  },
})
