import { Control } from 'react-hook-form'
import { z } from 'zod'

import type { FormSchema } from 'components/TransformationForm'
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from 'shadcn/form'

type CustomFieldProps = {
	control: Control<FormSchema> | undefined
	render: (props: { field: any }) => React.ReactNode
	name: keyof FormSchema
	formLabel?: string
	className?: string
}

export const CustomField = ({ control, render, name, formLabel, className }: CustomFieldProps) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{formLabel && <FormLabel>{formLabel}</FormLabel>}
					<FormControl>{render({ field })}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
