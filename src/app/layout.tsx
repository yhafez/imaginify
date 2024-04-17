import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { IBM_Plex_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'

const IBMPlex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-ibm-plex' })

export const metadata: Metadata = {
	title: 'Imaginify',
	description: 'An AI-powered image generator',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider
			appearance={{
				variables: { colorPrimary: '#624CF5' },
			}}>
			<html lang='en'>
				<body className={cn('font-IBMPlex antialiased', IBMPlex.variable)}>{children}</body>
			</html>
		</ClerkProvider>
	)
}
