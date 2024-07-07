'use client'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'shadcn/select'
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants'
import { AspectRatioKey, debounce, deepMergeObjects } from 'utils'
import TransformedImage from 'components/TransformedImage'
import { CustomField } from 'components/CustomField'
import MediaUploader from 'components/MediaUploader'
import { updateCredits } from 'actions/user.actions'
import { Button } from 'shadcn/button'
import { Input } from 'shadcn/input'
import { Form } from 'shadcn/form'

export const formSchema = z.object({
	title: z.string(),
	aspectRatio: z.string().optional(),
	color: z.string().optional(),
	prompt: z.string().optional(),
	publicId: z.string(),
})

export type FormSchema = z.infer<typeof formSchema>

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {
	const [image, setImage] = useState(data)
	const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isTransforming, setIsTransforming] = useState(false)
	const [transformationConfig, setTransformationConfig] = useState(config)
	const [isPending, startTransition] = useTransition()

	const transformationType = transformationTypes[type]

	const initialValues =
		data && action.toLocaleLowerCase() === 'update'
			? {
					title: data?.title,
					aspectRatio: data?.aspectRatio,
					color: data?.color,
					prompt: data?.prompt,
					publicId: data?.publicId,
			  }
			: defaultValues

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	})

	const onSubmit = (values: FormSchema) => {
		console.log(values)
	}

	const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
		const imageSize = aspectRatioOptions[value as AspectRatioKey]

		setImage((prevState: any) => ({
			...prevState,
			aspectRatio: imageSize.aspectRatio,
			width: imageSize.width,
			height: imageSize.height,
		}))

		setNewTransformation(transformationType.config)

		return onChangeField(value)
	}

	const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
		debounce(() => {
			setNewTransformation((prevState: any) => ({
				...prevState,
				[type]: {
					...prevState?.[type],
					[fieldName === 'prompt' ? 'prompt' : 'to']: value,
				},
			}))
		}, 1000)

		return onChangeField(value)
	}

	// TODO: Update creditFee to something else
	const onTransformHandler = () => {
		setIsTransforming(true)

		deepMergeObjects(newTransformation, transformationConfig)

		setNewTransformation(null)

		startTransition(async () => {
			await updateCredits(userId, -1)
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<CustomField
					control={form.control}
					name='title'
					formLabel='Image Title'
					className='w-full'
					render={({ field }) => <Input className='input-field' {...field} />}
				/>
				{type === 'fill' && (
					<CustomField
						control={form.control}
						name='aspectRatio'
						formLabel='Aspect Ratio'
						className='w-full'
						render={({ field }) => (
							<Select
								onValueChange={value =>
									onSelectFieldHandler(
										value,
										field.onChange,
									)
								}>
								<SelectTrigger className='select-field'>
									<SelectValue placeholder='Select size' />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(
										aspectRatioOptions,
									).map(
										key => (
											<SelectItem
												key={
													key
												}
												value={
													key
												}
												className='select-item'>
												{
													aspectRatioOptions[
														key as AspectRatioKey
													]
														.label
												}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
						)}
					/>
				)}

				{(type === 'remove' || type === 'recolor') && (
					<div className='prompt-field'>
						<CustomField
							control={form.control}
							name='prompt'
							formLabel={
								type ===
								'remove'
									? 'Object to remove'
									: 'Object to recolor'
							}
							className='w-full'
							render={({ field }) => (
								<Input
									value={
										field.value
									}
									className='input-field'
									onChange={e =>
										onInputChangeHandler(
											'prompt',
											e
												.target
												.value,
											type,
											field.onChange,
										)
									}
								/>
							)}
						/>

						{type === 'recolor' && (
							<CustomField
								control={
									form.control
								}
								name='color'
								formLabel='Replacement Color'
								className='w-full'
								render={({
									field,
								}) => (
									<Input
										value={
											field.value
										}
										className='input-field'
										onChange={e =>
											onInputChangeHandler(
												'color',
												e
													.target
													.value,
												'recolor',
												field.onChange,
											)
										}
									/>
								)}
							/>
						)}
					</div>
				)}

				<div className='media-uploader-field'>
					<CustomField
						control={form.control}
						name='publicId'
						formLabel='Upload Image'
						className='flex size-full flex-col'
						render={({ field }) => (
							<MediaUploader
								onValueChange={
									field.onChange
								}
								setImage={
									setImage
								}
								publicId={
									field.value
								}
								image={
									image
								}
								type={
									type
								}
							/>
						)}
					/>

					<TransformedImage
						image={image}
						type={type}
						title={form.getValues().title}
						isTransforming={isTransforming}
						setIsTransforming={setIsTransforming}
						transformationConfig={transformationConfig}
					/>
				</div>

				<div className='flex flex-col gap-4'>
					<Button
						type='button'
						className='submit-button capitalize'
						disabled={isTransforming || newTransformation === null}
						onClick={onTransformHandler}>
						{isTransforming
							? 'Transforming...'
							: 'Apply Transformation'}
					</Button>
					<Button
						type='submit'
						className='submit-button capitalize'
						disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Save Image'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default TransformationForm
