import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { transformationTypes } from '@/constants'
import Header from 'components/Header'
import { getUserById } from 'actions/user.actions'
import TransformationForm from 'components/TransformationForm'

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
	const { userId } = auth()

	const transformation = transformationTypes[type]

	if (!userId) redirect('/sign-in')
	const user = await getUserById(userId)

	return (
		<>
			<Header title={transformation.title} subtitle={transformation.subTitle} />
			<section className='mt-10'>
				<TransformationForm
					action='Add'
					userId={user._id}
					type={transformation.type as TransformationTypeKey}
					creditBalance={user.creditBalance}
				/>
			</section>
		</>
	)
}

export default AddTransformationTypePage
