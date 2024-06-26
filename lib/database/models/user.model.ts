import { Schema, Document, model, models } from 'mongoose'

export interface IUser extends Document {
	clerkId: string
	email: string
	firstName: string
	lastName: string
	username: string
	photo?: string
	planId: string
	creditBalance: number
	createdAt?: Date
	updatedAt?: Date
}

const UserSchema = new Schema({
	clerkId: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	photo: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	planId: { type: Number, default: 1 },
	creditBalance: { type: Number, default: 10 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
})

const User = models?.User || model('User', UserSchema)

export default User
