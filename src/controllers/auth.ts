import { NextFunction, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Err } from '../util/classes'
import User from '../models/user'
import { Req } from '../util/interfaces'

export const signup = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const nickname: string = req.body.nickname
	const password: string = req.body.password

	try {
		const emailExists = await User.findOne({ email: email })
		const nicknameExists = await User.findOne({ nickname: nickname })

		if (emailExists || nicknameExists) throw new Err(409, 'This email or nickname already exists!') 

		const hashedPassword: string = await bcrypt.hash(password, 12)
		const user = new User({
			email: email,
			nickname: nickname,
			password: hashedPassword,
		})
		await user.save()
		res.status(200).json({ message: 'User created successfully!' })
	} catch (err) {
		next(err)
	}
}

export const login = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const password: string = req.body.password

	try {
		const user = await User.findOne({ email: email })
		if (!user) throw new Err(404, 'User does not exist!') 

		const isEqual: boolean = await bcrypt.compare(password, user.password)
		if (!isEqual) throw new Err(409, 'Password does not match!') 

		const token = jwt.sign(
			{ email: email, userId: user._id },
			process.env.JWT_TOKEN!, {expiresIn: '1h'}
		)
		res
			.status(200)
			.json({ message: 'User logged in successfully!', token: token })
	} catch (err) {
		next(err)
	}
}
