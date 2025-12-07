"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import PriorityTabs from '@/components/ui/PriorityTabs';

import DueDate from '@/components/ui/DueDate';

import StatusSelection from '@/components/ui/StatusSelection';

export default function TaskDetail({
    isOpen,
    onOpenChange,
    isEditMode,
    formData,
    setFormData,
    onCancel,
    onSave
}) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="bg-[#1c1917] border-stone-800 text-stone-200 sm:max-w-[440px]">
                <SheetHeader>
                    <SheetTitle className="text-stone-100">{isEditMode ? 'Edit Task' : 'Add New Task'}</SheetTitle>
                    <SheetDescription className="text-stone-400">
                        {isEditMode ? 'Update the details of your task.' : 'Create a new task for your board.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6 w-[90%] mx-auto">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-[#292524] border-stone-700 focus-visible:ring-stone-500"
                            placeholder="Task title"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="flex min-h-[80px] w-full rounded-md border border-stone-700 bg-[#292524] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Task description..."
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Priority</label>
                        <PriorityTabs
                            value={formData.priority}
                            onValueChange={(val) => setFormData({ ...formData, priority: val })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="status" className="text-sm font-medium">Status</label>
                        <StatusSelection
                            value={formData.status}
                            onChange={(val) => setFormData({ ...formData, status: val })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                        <DueDate
                            value={formData.dueDate}
                            onChange={(val) => setFormData({ ...formData, dueDate: val })}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <Button variant="outline" onClick={onCancel} className="border-stone-700 text-stone-300 cursor-pointer hover:text-stone-100">Cancel</Button>
                    <Button onClick={onSave} className="bg-stone-100 text-stone-900 hover:bg-white" disabled={!formData.title}>
                        {isEditMode ? 'Save Changes' : 'Create Task'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
