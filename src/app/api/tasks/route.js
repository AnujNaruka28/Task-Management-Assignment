import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { taskSchema } from '@/lib/validations';
import rateLimit from '@/lib/rate-limit';

// Helper to get user from token
async function getUserFromRequest(req) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        throw new Error('No token provided');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        throw new Error('Invalid token');
    }

    return decoded;
}

// GET all tasks for authenticated user
export async function GET(req) {
    try {
        await rateLimit(req);
        await dbConnect();

        const user = await getUserFromRequest(req);
        const tasks = await Task.find({ userId: user.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error('GET /api/tasks error:', error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST create new task
export async function POST(req) {
    try {
        await rateLimit(req);
        await dbConnect();

        const user = await getUserFromRequest(req);
        const body = await req.json();

        const result = taskSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const task = await Task.create({
            ...result.data,
            userId: user.userId,
            column: result.data.status || 'todo',
        });

        // Add task to user's tasks array
        await User.findByIdAndUpdate(user.userId, {
            $push: { tasks: task._id }
        });

        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        console.error('POST /api/tasks error:', error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
