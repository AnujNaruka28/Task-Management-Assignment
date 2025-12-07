"use client";

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function StatusDot({ className }) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="currentColor"
            height="8"
            viewBox="0 0 8 8"
            width="8"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="4" cy="4" r="4" />
        </svg>
    );
}

export default function StatusSelection({ value, onChange }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 bg-[#292524] border-stone-700 text-stone-200"
            >
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1917] border-stone-800 text-stone-200 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                <SelectItem value="todo" className="focus:bg-[#292524] focus:text-stone-100 cursor-pointer">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-stone-500" />
                        <span className="truncate">To Do</span>
                    </span>
                </SelectItem>
                <SelectItem value="in_progress" className="focus:bg-[#292524] focus:text-stone-100 cursor-pointer">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-blue-500" />
                        <span className="truncate">In Progress</span>
                    </span>
                </SelectItem>
                <SelectItem value="done" className="focus:bg-[#292524] focus:text-stone-100 cursor-pointer">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-emerald-600" />
                        <span className="truncate">Done</span>
                    </span>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
