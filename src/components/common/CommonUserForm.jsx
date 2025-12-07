"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import apiService from "@/services/apiService";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function CommonUserForm({ type = "login" }) {
    const isLogin = type === "login";
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        setError("");
        setLoading(true);
        try {
            let result;
            if (isLogin) {
                result = await apiService.login(data.email, data.password);
                toast.success('Logged in successfully!', {
                    description: 'Welcome back to your dashboard',
                });
            } else {
                result = await apiService.signup(data.email, data.password);
                toast.success('Account created successfully!', {
                    description: 'Welcome to your new dashboard',
                });
            }

            console.log('Auth result:', result);

            // Verify token is stored
            const storedToken = localStorage.getItem('access_token');
            console.log('Stored token:', storedToken);

            // Dispatch storage event for Navbar update
            window.dispatchEvent(new Event("storage"));

            // Use setTimeout to show toast before redirect
            setTimeout(() => {
                if (storedToken) {
                    router.replace("/dashboard/tasks");
                } else {
                    console.error('Token not stored!');
                    setError('Authentication succeeded but token not stored');
                }
            }, 1000);
        } catch (err) {
            setError(err.message);
            toast.error('Authentication failed', {
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#1c1917] px-4">
            <div className="w-full max-w-sm space-y-6 rounded-lg border border-stone-800 bg-[#1c1917] p-6 shadow-xl text-stone-200">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-stone-100">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-sm text-stone-400">
                        {isLogin
                            ? "Enter your email to sign in to your account"
                            : "Enter your email below to create your account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-stone-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="bg-[#292524] border-stone-700 text-stone-100 focus-visible:ring-stone-500 placeholder:text-stone-500"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-stone-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            className="bg-[#292524] border-stone-700 text-stone-100 focus-visible:ring-stone-500"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <Button type="submit" disabled={loading} className="w-full bg-stone-100 text-stone-900 hover:bg-stone-200 cursor-pointer">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Spinner size="sm" />
                                Processing...
                            </span>
                        ) : (
                            isLogin ? "Sign In" : "Sign Up"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-stone-400">
                    {isLogin ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="underline hover:text-stone-100">
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link href="/login" className="underline hover:text-stone-100">
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
