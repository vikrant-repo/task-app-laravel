import TaskContainer from '@/components/task-container';
import AppLayout from '@/layouts/app-layout';
import apiService from '@/lib/apiService';
import { Column } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function TaskList() {
    const [columns, setColumns] = useState<Column[]>([])

    const fetchColumns = async () => {
        try {
            const result = await apiService.get<Column[]>('/api/columns');
            setColumns(result);
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

    useEffect(() => {
        fetchColumns();
    }, []);
    return (
        <AppLayout>
            <Head title="Task List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <TaskContainer 
                    createColumn={createColumn}
                    columns={columns} 
                    updateColumn={updateColumn}
                    deleteColumn={deleteColumn}
                />
                
            </div>
        </AppLayout>
    );
}

