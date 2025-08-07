import TaskContainer from '@/components/task-container';
import AppLayout from '@/layouts/app-layout';
import apiService from '@/lib/apiService';
import { Column, Id, Task } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function TaskList() {
    const [columns, setColumns] = useState<Column[]>([])
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchColumns = async () => {
        try {
            const result = await apiService.get<Column[]>('/api/columns');
            setColumns(result);
        } catch (err) {
            console.error('Failed to fetch columns', err);
        }
    };

     const fetchTasks = async () => {
        try {
            const result = await apiService.get<Task[]>('/api/tasks');
            setTasks(result);
        } catch (err) {
            console.error('Failed to fetch columns', err);
        }
    };

    const updateColumn = async (id: string | number, name: string) => {
        try {
            const updatedColumn = await apiService.put<Column>(`/api/columns/${id}`, { name });
            setColumns((prev) => prev.map((col) => (col.id === id ? updatedColumn : col)));
        } catch (err) {
            console.error('Failed to update column', err);
        }
    };

    const deleteColumn = async (id: string | number) => {
        try {
            await apiService.delete(`/api/columns/${id}`);
            setColumns((prev) => prev.filter((col) => col.id !== id));
        } catch (err) {
            console.error('Failed to delete column', err);
        }
    }

    const createColumn = async (data: { name: string }) => {
    try {
        const newColumn = await apiService.post<Column>('/api/columns', data);
        setColumns((prev) => [...prev, newColumn]);
    } catch (err) {
        console.error('Failed to create column', err);
    }
    };

    const createTask = async (data: { column_id: string | number; title: string }) => {
        try {
            const newTask = await apiService.post<Task>('/api/tasks', {
                column_id: data.column_id,
                title: data.title,
            });
            setTasks((prev) => [...prev, newTask]);
        } catch (err) {
            console.error('Failed to create task', err);
        }
    };

      const updateTask = async (id: string | number, title: string, column_id: Id) => {
        try {
            const updatedData = await apiService.put<Task>(`/api/tasks/${id}`, { title,column_id });
            setTasks((prev) => prev.map((task) => (task.id === id ? updatedData : task)));
        } catch (err) {
            console.error('Failed to update column', err);
        }
    };

    const deleteTask = async (id: string | number) => {
        try {
            await apiService.delete(`/api/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            console.error('Failed to delete column', err);
        }
    }

    useEffect(() => {
        fetchColumns();
        fetchTasks();
    }, []);
    return (
        <AppLayout>
            <Head title="Task List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <TaskContainer 
                    columns={columns}
                    tasks={tasks}
                    createColumn={createColumn}
                    updateColumn={updateColumn}
                    deleteColumn={deleteColumn}
                    createTask={createTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                />
                
            </div>
        </AppLayout>
    );
}

