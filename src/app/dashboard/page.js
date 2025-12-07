"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('Dashboard token check:', token);

        if (!token) {
            // No token, redirect to login
            router.push('/login');
        } else {
            // Has token, redirect to tasks
            router.push('/dashboard/tasks');
        }
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#1c1917]">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-stone-400">Loading dashboard...</p>
            </div>
        </div>
    );
}
