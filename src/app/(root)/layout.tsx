import type { ReactNode } from 'react'
import MobileNav from '@/src/components/shared/MobileNav'
import Sidebar from '@/src/components/shared/Sidebar'

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className='root'>
			<Sidebar />
			<MobileNav />
			<div className='root-container'>
				<div className='wrapper'>{children}</div>
			</div>
		</main>
	)
}

export default Layout
