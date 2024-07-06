import type { ReactNode } from 'react'

import MobileNav from 'components/MobileNav'
import Sidebar from 'components/Sidebar'
import { Toaster } from 'shadcn/toaster'

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className='root'>
			<Sidebar />
			<MobileNav />
			<div className='root-container'>
				<div className='wrapper'>{children}</div>
			</div>
			<Toaster />
		</main>
	)
}

export default Layout
