"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, CreditCard, LogOut, User } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";

export function ProfileChecker({
    user = { name: "User", plan: "Free", avatar: "" }
}) {
    const { isMobile } = useSidebar();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.dispatchEvent(new Event("storage"));
        router.push("/login");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-[#292524] data-[state=open]:text-[#fff] hover:bg-[#1c1917] cursor-pointer hover:text-[#fff]">
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#292524] text-[#fff]">
                                <User className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-stone-50">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-stone-50">{user.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto text-stone-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mb-4"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}>
                        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                            Profile
                            <div className="ml-auto size-6 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
                                {user.avatar && <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />}
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                            Plan
                            <CreditCard className="ml-auto size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="gap-2 p-2 text-red-600 focus:text-red-600 cursor-pointer">
                            Log out
                            <LogOut className="ml-auto size-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
