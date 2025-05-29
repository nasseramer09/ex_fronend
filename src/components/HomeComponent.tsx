import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../services/api";
import "./styles/Home.css";

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

interface UserDetails {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone_number: string;
}

interface TaskStats {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
}

export default function HomeComponent() {
    const { userId, userRole } = useAuth();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskStats, setTaskStats] = useState<TaskStats>({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                setError("");

                const userData = await apiRequest<UserDetails>(`/api/users/${userId}`, 'GET');
                setUserDetails(userData);

                let tasksData: Task[];
                if (userRole === 'admin') {
                    tasksData = await apiRequest<Task[]>('/api/tasks/get_all_tasks', 'GET');
                } else {
                    tasksData = await apiRequest<Task[]>(`/api/tasks/get_user_tasks/${userId}`, 'GET');
                }
                setTasks(tasksData);

                const stats = {
                    total: tasksData.length,
                    active: tasksData.filter(task => task.status === 'pågående').length,
                    completed: tasksData.filter(task => task.status === 'klart').length,
                    cancelled: tasksData.filter(task => task.status === 'avbrutet').length
                };
                setTaskStats(stats);

            } catch (error: any) {
                console.error("Error fetching data:", error);
                setError(error.message || "Ett fel uppstod vid hämtning av data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, userRole]);

    if (loading) return <div className="loading">Laddar data...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-container">
            {userDetails && (
                <div className="user-info-card">
                    <h2>Välkommen, {userDetails.first_name}!</h2>
                    <div className="user-details">
                        <p><strong>Namn:</strong> {userDetails.first_name} {userDetails.last_name}</p>
                        <p><strong>E-post:</strong> {userDetails.email}</p>
                        <p><strong>Roll:</strong> {userDetails.role}</p>
                        {userDetails.phone_number && (
                            <p><strong>Telefon:</strong> {userDetails.phone_number}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="stats-container">
                <h3>Statistik</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Totalt</h4>
                        <p>{taskStats.total}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Aktiva</h4>
                        <p>{taskStats.active}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Genomförda</h4>
                        <p>{taskStats.completed}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Avbrutna</h4>
                        <p>{taskStats.cancelled}</p>
                    </div>
                </div>
            </div>

            <div className="recent-tasks">
                <h3>Senaste uppgifter</h3>
                {tasks.length === 0 ? (
                    <p>Inga uppgifter hittades</p>
                ) : (
                    <div className="tasks-grid">
                        {tasks.slice(0, 5).map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <div className="task-details">
                                    <span className="task-time">
                                        {new Date(task.start_time).toLocaleString('sv-SE')}
                                    </span>
                                    <span className={`task-status ${task.status}`}>
                                        {task.status}
                                    </span>
                                </div>
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
        </div>
    );
}
