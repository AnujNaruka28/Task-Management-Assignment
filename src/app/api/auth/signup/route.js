import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { userAuthSchema } from '@/lib/validations';
import rateLimit from '@/lib/rate-limit';

export async function POST(req) {
    try {
        await rateLimit(req);
        await dbConnect();

        const body = await req.json();
        const result = userAuthSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const { email, password } = result.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        const token = signToken({ userId: user._id, email: user.email });

        return NextResponse.json({ token, user: { email: user.email, id: user._id } }, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
