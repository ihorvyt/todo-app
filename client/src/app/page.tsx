"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState("");

    const axiosInstance = axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/todos`,
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        axiosInstance.get("/")
            .then((res) => setTasks(res.data))
            .catch((err) => console.error("Error fetching tasks:", err));
    }, []);

    const addTask = async () => {
        if (!newTask.trim()) return;

        try {
            const { data } = await axiosInstance.post("/", { title: newTask });
            setTasks([...tasks, data]);
            setNewTask("");
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    const toggleTaskCompletion = async (id: string, completed: boolean) => {
        try {
            await axiosInstance.put(`/${id}`, { completed: !completed });
            setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)));
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const removeTask = async (id: string) => {
        try {
            await axiosInstance.delete(`/${id}`);
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingTaskTitle(task.title);
    };

    const saveEditingTask = async () => {
        if (!editingTaskTitle.trim() || !editingTaskId) return;

        try {
            await axiosInstance.put(`/${editingTaskId}`, { title: editingTaskTitle });
            setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, title: editingTaskTitle } : task)));
            setEditingTaskId(null);
            setEditingTaskTitle("");
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <Card className="w-full max-w-lg p-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-center text-xl">Todo List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <Button onClick={addTask}>Add</Button>
                    </div>
                    <ul className="space-y-2">
                        {tasks.map((task) => (
                            <li key={task.id} className="flex justify-between p-2 bg-gray-200 rounded items-center">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                                    />
                                    {editingTaskId === task.id ? (
                                        <Input
                                            type="text"
                                            value={editingTaskTitle}
                                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && saveEditingTask()}
                                        />
                                    ) : (
                                        <span
                                            className={task.completed ? "line-through text-gray-500 cursor-pointer" : "cursor-pointer"}
                                            onClick={() => startEditing(task)}
                                        >
                                            {task.title}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {editingTaskId === task.id ? (
                                        <Button onClick={saveEditingTask} size="sm">Save</Button>
                                    ) : (
                                        <Button onClick={() => startEditing(task)} size="sm">Edit</Button>
                                    )}
                                    <Button variant="destructive" size="sm" onClick={() => removeTask(task.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}