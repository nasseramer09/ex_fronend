import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import './styles/Calendar.css';


interface Task {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
}

export default function CalendarComponent() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await apiRequest<Task[]>('/api/tasks/get_all_tasks', 'GET');
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    return (

        <div className="calendar-page">
            <h1>Kalender</h1>
        </div>
        
    );
} 