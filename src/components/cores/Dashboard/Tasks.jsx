"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    KanbanBoard,
    KanbanCard,
    KanbanCards,
    KanbanHeader,
    KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Calendar, Trash2, Edit } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import apiService from '@/services/apiService';
import TaskDetail from './TaskDetail';

const COLUMNS = [
    { id: 'todo', name: 'To Do' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'done', name: 'Done' },
];

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'todo'
    });

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await apiService.getTasks();
            console.log(response);
            const fetchedTasks = response.tasks.map(task => ({
                ...task,
                id: task._id,
                column: task.status,
            }));
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error("Failed to load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [tasks, searchQuery]);

    const handleAddTask = async () => {
        try {
            const response = await apiService.createTask(formData);
            const newTask = {
                ...response.task,
                id: response.task._id,
                column: response.task.status,
            };
            setTasks([...tasks, newTask]);
            toast.success("Task created successfully!");
            resetForm();
            setIsSheetOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error(error.message || "Failed to create task. Please try again.");
        }
    };

    const handleEditTask = async () => {
        try {
            const response = await apiService.updateTask(currentTask._id, formData);
            const updatedTask = {
                ...response.task,
                id: response.task._id,
                column: response.task.status,
            };
            setTasks(tasks.map(t => t.id === currentTask.id ? updatedTask : t));
            toast.success("Task updated successfully!");
            resetForm();
            setIsSheetOpen(false);
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error(error.message || "Failed to update task. Please try again.");
        }
    };

    const handleDeleteTask = async (task) => {
        try {
            await apiService.deleteTask(task._id);
            setTasks(tasks.filter(t => t.id !== task.id));
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error(error.message || "Failed to delete task. Please try again.");
        }
    };

    const openAddSheet = () => {
        resetForm();
        setIsEditMode(false);
        setIsSheetOpen(true);
    };

    const openEditSheet = (task) => {
        setCurrentTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate || '',
            priority: task.priority || 'medium',
            status: task.status
        });
        setIsEditMode(true);
        setIsSheetOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            status: 'todo'
        });
        setCurrentTask(null);
    };

    // Handle drag and drop with API updates
    const handleDataChange = async (newData) => {
        // If searching, prevents reordering from deleting hidden tasks
        if (searchQuery.trim()) {
            const updates = new Map(newData.map(i => [i.id, i]));
            const updatedTasks = tasks.map(t => {
                const updated = updates.get(t.id);
                if (updated && updated.column !== t.column) {
                    // Status changed - update via API
                    apiService.updateTask(t._id, {
                        ...t,
                        status: updated.column,
                        column: updated.column
                    }).catch(err => {
                        console.error('Error updating task status:', err);
                        toast.error("Failed to update task status.");
                    });
                    return { ...t, column: updated.column, status: updated.column };
                }
                return t;
            });
            setTasks(updatedTasks);
            return;
        }

        // Organize by column to calculate priorities based on position
        const columnsData = {};
        newData.forEach(t => {
            if (!columnsData[t.column]) columnsData[t.column] = [];
            columnsData[t.column].push(t);
        });

        const priorityMap = {};
        const statusChanges = new Map();
        const priorityChanges = new Map();

        // Calculate new priorities and detect changes
        Object.values(columnsData).forEach(items => {
            items.forEach((item, idx) => {
                const ratio = items.length > 1 ? idx / (items.length - 1) : 0;
                let p = 'low';
                if (ratio < 0.33) p = 'high';
                else if (ratio < 0.66) p = 'medium';
                priorityMap[item.id] = p;

                // Find original task
                const originalTask = tasks.find(t => t.id === item.id);
                if (originalTask) {
                    // Check if status changed (horizontal drag)
                    if (originalTask.column !== item.column) {
                        statusChanges.set(item.id, item.column);
                    }
                    // Check if priority changed (vertical drag within same column)
                    if (originalTask.priority !== p && originalTask.column === item.column) {
                        priorityChanges.set(item.id, p);
                    }
                }
            });
        });

        // Update tasks with new priorities and status
        const updatedTasks = newData.map(t => ({
            ...t,
            status: t.column,
            priority: priorityMap[t.id] || 'low'
        }));
        setTasks(updatedTasks);

        // Make API calls for changes
        for (const [taskId, newStatus] of statusChanges) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                try {
                    await apiService.updateTask(task._id, {
                        ...task,
                        status: newStatus,
                        column: newStatus,
                    });
                } catch (error) {
                    console.error('Error updating task status:', error);
                    toast.error("Failed to update task status.");
                }
            }
        }

        for (const [taskId, newPriority] of priorityChanges) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                try {
                    await apiService.updateTask(task._id, {
                        ...task,
                        priority: newPriority,
                    });
                } catch (error) {
                    console.error('Error updating task priority:', error);
                    toast.error("Failed to update task priority.");
                }
            }
        }
    };

    // Skeleton loader component for task cards
    const TaskSkeleton = () => (
        <div className="bg-[#292524] border border-stone-700 rounded-lg p-4 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-stone-700" />
            <Skeleton className="h-4 w-full bg-stone-700" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 bg-stone-700" />
                <Skeleton className="h-4 w-20 bg-stone-700" />
            </div>
        </div>
    );

    return (
        <div className="w-full h-full p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-100">Tasks</h1>
                    <p className="text-stone-400">Manage and track your projects.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
                        <Input
                            type="search"
                            placeholder="Search tasks..."
                            className="pl-9 bg-[#1c1917] border-stone-800 text-stone-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openAddSheet} className="text-white bg-[#292524] cursor-pointer hover:bg-white hover:text-stone-900">
                        <Plus className="mr-2 h-4 w-4" />
                        <p>Add Task</p>
                    </Button>
                </div>
            </div>

            <KanbanProvider
                data={filteredTasks}
                columns={COLUMNS}
                onDataChange={handleDataChange}
                className="flex-1 gap-4"
            >
                {(column) => (
                    <KanbanBoard key={column.id} id={column.id} className="bg-[#1c1917] border-stone-800 h-[500px] overflow-y-auto">
                        <KanbanHeader className="text-stone-300 border-b border-stone-800 bg-[#292524]/50">
                            {column.name}
                            <span className="ml-2 text-xs text-stone-500 font-normal">
                                {isLoading ? '' : filteredTasks.filter(t => t.column === column.id).length}
                            </span>
                        </KanbanHeader>
                        {isLoading ? (
                            <div className="space-y-3 p-4">
                                <TaskSkeleton />
                                <TaskSkeleton />
                                <TaskSkeleton />
                            </div>
                        ) : (
                            <KanbanCards id={column.id}>
                                {(item) => (
                                    <KanbanCard key={item.id} id={item.id} name={item.title} className="bg-[#292524] border-stone-700 hover:border-stone-500 group">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-medium text-stone-200 line-clamp-2">{item.title}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#1c1917] border-stone-800 text-stone-200">
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                openEditSheet(item);
                                                            }}
                                                            className="focus:bg-[#292524] focus:text-stone-100 cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteTask(item)}
                                                            className="text-red-400 focus:text-red-400 focus:bg-[rgba(239,68,68,0.1)] cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-stone-400 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-1">
                                                <div className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                                                    item.priority === 'high' ? "bg-red-500/10 text-red-500" :
                                                        item.priority === 'medium' ? "bg-yellow-500/10 text-yellow-500" :
                                                            "bg-green-500/10 text-green-500"
                                                )}>
                                                    {item.priority}
                                                </div>
                                                {item.dueDate && (
                                                    <div className="flex items-center text-xs text-stone-500">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {item.dueDate}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </KanbanCard>
                                )}
                            </KanbanCards>
                        )}
                    </KanbanBoard>
                )}
            </KanbanProvider>

            <TaskDetail
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                isEditMode={isEditMode}
                formData={formData}
                setFormData={setFormData}
                onCancel={() => setIsSheetOpen(false)}
                onSave={isEditMode ? handleEditTask : handleAddTask}
            />
        </div>
    );
}
