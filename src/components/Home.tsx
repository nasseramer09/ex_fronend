import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../services/api";
import "./styles/Home.css";

type Task = {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    start_adress: string;
    destination_adress: string;
    status: string;
};

type TaskStats = {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
};

type UserDetails = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone_number: string;
};

export default function Home() {
    const { userRole, userId } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [stats, setStats] = useState<TaskStats>({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                
                // Fetch user details
                try {
                    const userData = await apiRequest<UserDetails>(`/api/users/${userId}`, 'GET');
                    setUserDetails(userData);
                } catch (userError: any) {
                    console.error("Error fetching user details:", userError);
                    setError("Kunde inte hämta användarinformation");
                    return;
                }

                try {
                    let endpoint = '/api/tasks/get_all_tasks';
                    if (userRole === 'personal') {
                        endpoint = `/api/tasks/get_user_tasks/${userId}`;
                    }

                    const tasksData = await apiRequest<Task[]>(endpoint, 'GET');
                    setTasks(tasksData);

                    const taskStats = {
                        total: tasksData.length,
                        active: tasksData.filter(task => task.status === 'pågående').length,
                        completed: tasksData.filter(task => task.status === 'klart').length,
                        cancelled: tasksData.filter(task => task.status === 'avbrutet').length
                    };
                    setStats(taskStats);
                } catch (taskError: any) {
                    console.error("Error fetching tasks:", taskError);
                    setError("Kunde inte hämta uppdrag");
                }
            } catch (error: any) {
                console.error("General error:", error);
                setError(error.message || "Ett fel uppstod vid hämtning av data");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userRole, userId]);

    const timeFormat = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/\//g, '-');
    };

    if (loading) {
        return <div className="loading">Laddar...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="home-container">
            <h1>Välkommen {userDetails?.first_name} {userDetails?.last_name}</h1>
            
            <div className="user-info-card">
                <h2>Din Information</h2>
                <div className="user-details">
                    <div className="detail-row">
                        <span className="label">Namn:</span>
                        <span>{userDetails?.first_name} {userDetails?.last_name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">E-post:</span>
                        <span>{userDetails?.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Telefon:</span>
                        <span>{userDetails?.phone_number || 'Ej angivet'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Roll:</span>
                        <span>{userDetails?.role === 'admin' ? 'Administratör' : 'Personal'}</span>
                    </div>
                </div>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Totalt antal uppdrag</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Aktiva uppdrag</h3>
                    <p className="stat-number">{stats.active}</p>
                </div>
                <div className="stat-card">
                    <h3>Genomförda uppdrag</h3>
                    <p className="stat-number">{stats.completed}</p>
                </div>
                <div className="stat-card">
                    <h3>Avbrutna uppdrag</h3>
                    <p className="stat-number">{stats.cancelled}</p>
                </div>
            </div>

            <div className="tasks-section">
                <h2>Dina uppdrag</h2>
                <div className="tasks-grid">
                    {tasks.map(task => (
                        <div key={task.id} className="task-card">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <div className="task-details">
                                <div className="task-detail">
                                    <span className="label">Starttid:</span>
                                    <span>{timeFormat(task.start_time)}</span>
                                </div>
                                <div className="task-detail">
                                    <span className="label">Sluttid:</span>
                                    <span>{timeFormat(task.end_time)}</span>
                                </div>
                                <div className="task-detail">
                                    <span className="label">Från:</span>
                                    <span>{task.start_adress}</span>
                                </div>
                                <div className="task-detail">
                                    <span className="label">Till:</span>
                                    <span>{task.destination_adress}</span>
                                </div>
                                <div className="task-detail">
                                    <span className="label">Status:</span>
                                    <span className={`status ${task.status}`}>{task.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 