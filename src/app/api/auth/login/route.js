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

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user._id, email: user.email });

    return NextResponse.json({ token, user: { email: user.email, id: user._id } }, { status: 200 });
  } catch (error) {
    if (error.message === 'Too Many Requests') {
        return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
