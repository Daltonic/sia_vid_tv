'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/config'
import { createWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()
if (!projectId) throw new Error('Project ID is not defined')

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  enableOnramp: false,
})

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  const { setThemeVariables } = useWeb3ModalTheme()

  setThemeVariables({
    '--w3m-accent': '#22C55E',
    '--w3m-color-mix-strength': 0,
  })

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
