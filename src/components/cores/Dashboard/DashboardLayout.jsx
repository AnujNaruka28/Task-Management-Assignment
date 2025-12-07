"use client"
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DashboardLayout = ({ children }) => {
    const pathname = usePathname();
    // Split pathname to get segments, removing empty strings
    const segments = pathname.split('/').filter(Boolean);
    // segments[0] is likely 'dashboard'
    const currentSegment = segments[segments.length - 1];

    // Helper to capitalize
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset className="bg-[#1c1917] overflow-y-auto w-[90%] h-[98%] flex justify-center-safe items-center-safe">
                {/* Main Content */}
                <div className="flex flex-col gap-4 p-4 pt-0 mx-auto my-auto w-[90%] h-[90%]">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">
                                    <HomeIcon aria-hidden="true" size={16} />
                                    <span className="sr-only">Home</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <span className="text-stone-400">/</span>
                            </BreadcrumbSeparator>

                            {/* Dashboard is always a parent here, but if we are ON dashboard page, it's the current page */}
                            {segments.length === 1 && segments[0] === 'dashboard' ? (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            ) : (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {segments.slice(1).map((segment, index) => {
                                        const isLast = index === segments.slice(1).length - 1;
                                        const href = `/dashboard/${segments.slice(1, index + 1).join('/')}`;

                                        return (
                                            <React.Fragment key={segment}>
                                                <BreadcrumbSeparator>
                                                    <span className="text-stone-400">/</span>
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    {isLast ? (
                                                        <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink href={href}>{capitalize(segment)}</BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </React.Fragment>
                                        );
                                    })}
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
