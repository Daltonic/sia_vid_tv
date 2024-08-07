import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/config'
import { headers } from 'next/headers'
import Web3ModalProvider from '@/context'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VidTv',
  description: 'Stream video directly from the Sia blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>
          <div className="flex flex-col h-[100vh]">
            <Header />

            <main className="flex-grow mt-16 p-4 sm:p-8 max-w-7xl sm:mx-auto w-full">
              {children}
            </main>

            <Footer />
          </div>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Web3ModalProvider>
      </body>
    </html>
  )
}
