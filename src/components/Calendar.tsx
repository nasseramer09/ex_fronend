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
    assigned_users_details: Array<{
        first_name: string;
        last_name: string;
    }>;
}

export default function Calendar() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.start_time);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const renderCalendar = () => {
        const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
        const days = [];
        const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 
                          'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayTasks = getTasksForDate(date);
            
            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-number">{day}</span>
                    {dayTasks.length > 0 && (
                        <div className="task-indicator">{dayTasks.length}</div>
                    )}
                </div>
            );
        }

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                        &lt;
                    </button>
                    <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                        &gt;
                    </button>
                </div>
                <div className="calendar-grid">
                    <div className="weekday">Mån</div>
                    <div className="weekday">Tis</div>
                    <div className="weekday">Ons</div>
                    <div className="weekday">Tor</div>
                    <div className="weekday">Fre</div>
                    <div className="weekday">Lör</div>
                    <div className="weekday">Sön</div>
                    {days}
                </div>
            </div>
        );
    };

    const renderSelectedDateTasks = () => {
        if (!selectedDate) return null;

        const tasksForDate = getTasksForDate(selectedDate);
        
        return (
            <div className="selected-date-tasks">
                <h3>Uppgifter för {selectedDate.toLocaleDateString('sv-SE')}</h3>
                {tasksForDate.length === 0 ? (
                    <p>Inga uppgifter schemalagda för denna dag</p>
                ) : (
                    <div className="tasks-list">
                        {tasksForDate.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <div className="task-time">
                                    {new Date(task.start_time).toLocaleTimeString('sv-SE')} - 
                                    {new Date(task.end_time).toLocaleTimeString('sv-SE')}
                                </div>
                                <div className="task-status">{task.status}</div>
                                <div className="task-assignees">
                                    {task.assigned_users_details.map(user => 
                                        `${user.first_name} ${user.last_name}`
                                    ).join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="calendar-page">
            {renderCalendar()}
            {renderSelectedDateTasks()}
        </div>
    );
} 