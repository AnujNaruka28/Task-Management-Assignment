"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ButtonHoverTopSlowFlip from './ButtonHoverTopSlowFlip';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token");
            setIsAuthenticated(!!token);
        };

        checkAuth();
        // Listen for storage events (e.g. from other tabs or dispatched manually)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    // Hide navbar on dashboard routes if needed (though user mainly asked for route protection, this is UI protection)
    if (pathname?.startsWith('/dashboard')) return null;

    const handleDashboardClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error('Login required', {
                description: 'Please log in to access the dashboard',
            });
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
    };

    return (
        <nav className="flex w-full justify-end items-center px-8 py-4 bg-[#1c1917]/50 backdrop-blur-md border-b border-stone-800 sticky top-0 z-50">
            {isAuthenticated ? (
                <Link href="/dashboard">
                    <ButtonHoverTopSlowFlip initialText="Dashboard" hoverText="Track" />
                </Link>
            ) : (
                <>
                    <div onClick={handleDashboardClick} className="cursor-pointer">
                        <ButtonHoverTopSlowFlip initialText="Dashboard" hoverText="Login" />
                    </div>
                    <Link href="/login" className="ml-4">
                        <ButtonHoverTopSlowFlip initialText="Log In" hoverText="Sign Up" />
                    </Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;

