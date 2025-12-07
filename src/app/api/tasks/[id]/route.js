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

// GET task by ID
export async function GET(req, { params }) {
    try {
        await rateLimit(req);
        await dbConnect();

        const user = await getUserFromRequest(req);
        const { id } = await params;

        const task = await Task.findOne({ _id: id, userId: user.userId });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        console.error('GET /api/tasks/[id] error:', error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT update task by ID
export async function PUT(req, { params }) {
    try {
        await rateLimit(req);
        await dbConnect();

        const user = await getUserFromRequest(req);
        const { id } = await params;
        const body = await req.json();

        const result = taskSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: user.userId },
            {
                ...result.data,
                column: result.data.status || result.data.column
            },
            { new: true }
        );

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/tasks/[id] error:', error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE task by ID
export async function DELETE(req, { params }) {
    try {
        await rateLimit(req);
        await dbConnect();

        const user = await getUserFromRequest(req);
        const { id } = await params;

        const task = await Task.findOneAndDelete({ _id: id, userId: user.userId });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Remove task from user's tasks array
        await User.findByIdAndUpdate(user.userId, {
            $pull: { tasks: id }
        });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/tasks/[id] error:', error);
        if (error.message === 'Too Many Requests') {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
