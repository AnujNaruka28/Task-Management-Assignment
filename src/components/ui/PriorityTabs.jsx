import React from 'react';
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export default function PriorityTabs({ value, onValueChange }) {
    return (
        <Tabs value={value} onValueChange={onValueChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#292524] text-stone-400">
                {['low', 'medium', 'high'].map((priority) => (
                    <TabsTrigger
                        key={priority}
                        value={priority}
                        className="capitalize data-[state=active]:bg-[#1c1917] data-[state=active]:text-stone-100"
                    >
                        {priority}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
