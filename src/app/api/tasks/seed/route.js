import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import tasksData from '@/data/tasks.json';

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

// POST endpoint to seed tasks for the authenticated user
export async function POST(req) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);

        // Check if user already has tasks
        const existingTasks = await Task.find({ userId: user.userId });

        if (existingTasks.length > 0) {
            return NextResponse.json({
                message: 'User already has tasks',
                count: existingTasks.length
            }, { status: 400 });
        }

        // Create tasks with the authenticated user's ID
        const tasksToInsert = tasksData.map(task => ({
            ...task,
            userId: user.userId
        }));

        const result = await Task.insertMany(tasksToInsert);

        return NextResponse.json({
            message: 'Tasks imported successfully',
            count: result.length,
            tasks: result
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/tasks/seed error:', error);
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}
