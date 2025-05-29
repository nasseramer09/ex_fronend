import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaPhone } from "react-icons/fa";
import { apiRequest } from "../services/api";
import "./styles/userDetails.css";

interface AssignedTask {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    start_adress: string;
    destination_adress: string;
    status: string;
}
interface UserDetailData {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    role: string;
    phone_number: string;
    email: string;
    created_at: string;
    is_occupied: boolean;
    assigned_tasks: AssignedTask[];
}


export default function UserDetail() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        role: "",
        phone_number: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchUserDetail = async () => {
            if (!userId) {
                setError("Inget användar-ID angivet.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await apiRequest<UserDetailData>(`/api/users/${userId}`, 'GET');
                setUser(response);
                setFormData({
                    first_name: response.first_name,
                    last_name: response.last_name,
                    username: response.username,
                    role: response.role,
                    phone_number: response.phone_number,
                    email: response.email,
                    password: "",
                    confirmPassword: ""
                });
                setError("");
            } catch (error: any) {
                setError(error.message || `Kunde inte hämta användardata för ID ${userId}.`);
                console.error(`Fel vid hämtning av användare ${userId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Lösenorden matchar inte.");
            return;
        }

        try {
            const payload: { [key: string]: any } = {};
            for (const key in formData) {
                if (key !== "confirmPassword" && key !== "password") {
                    payload[key] = (formData as any)[key];
                } else if (key === "password" && formData.password) {
                    payload[key] = formData.password;
                }
            }

            const response = await apiRequest<UserDetailData>(`/api/users/${userId}`, 'PATCH', payload);
            setUser(response); 
            setIsEditing(false);
            setError("");
        } catch (error: any) {
            setError(error.message || "Uppdatering misslyckades.");
            console.error("Fel vid uppdatering av användare:", error);
        }
    };

    const handleDeleteUser = async () => {
        if (!window.confirm(`Är du säker på att du vill ta bort användaren ${user?.username}?`)) {
            return;
        }
        try {
            const response = await apiRequest<{ message: string }>(`/api/users/${userId}`, 'DELETE');
            alert(response.message);
            navigate('/admin/users');
        } catch (error: any) {
            setError(error.message || "Borttagning misslyckades.");
            console.error("Fel vid borttagning av användare:", error);
        }
    };

    if (loading) {
        return <div className="detail-message loading-message"><p>Laddar användardata...</p></div>;
    }

    if (error) {
        return <div className="detail-message error-message"><p>{error}</p></div>;
    }

    if (!user) {
        return <div className="detail-message no-user-data-message"><p>Ingen användardata hittades.</p></div>;
    }

    return (
        <div className="user-detail-page-container">
            {error && <p className="detail-message error-message">{error}</p>}
             <div className="back-button-container">
                <button 
                    onClick={() => navigate('/adminPanel')} 
                    className="action-button back-button"
                >
                    <FaArrowLeft /> Tillbaka till användare
                </button>
            </div>
            <h2> {user.first_name} {user.last_name}</h2>

            <div className="user-info-card">
                {isEditing ? (
                    <form onSubmit={handleUpdateSubmit} className="user-edit-form">
                        <div className="form-field-group">
                            <label>
                                Förnamn:
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Efternamn:
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Användarnamn:
                                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                            </label>
                            <label>
                                E-post:
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Telefonnummer:
                                <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
                            </label>
                            <label>
                                Roll:
                                <select name="role" value={formData.role} onChange={handleInputChange} required>
                                    <option value="admin">Admin</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </label>
                            <label>
                                Nytt Lösenord (lämna tomt om ingen ändring):
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                            </label>
                            <label>
                                Bekräfta Nytt Lösenord:
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                            </label>
                        </div>
                        <div className="action-buttons-group">
                            <button type="submit" className="action-button save-button">Spara ändringar</button> 
                            <button type="button" className="action-button cancel-button" onClick={() => setIsEditing(false)}>Avbryt</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="info-pair">
                            <span className="info-label">Förnamn:</span>
                            <span>{user.first_name}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label">Efternamn:</span>
                            <span>{user.last_name}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label">Användarnamn:</span>
                            <span>{user.username}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label">Roll:</span>
                            <span>{user.role}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label"><FaPhone /></span>
                            <span>{user.phone_number}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label"><FaEnvelope /></span>
                            <span>{user.email}</span>
                        </div>
                        <div className="info-pair">
                            <span className="info-label">Konto skapat:</span>
                            <span>{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                         <div className="info-pair">
                            <span className="info-label">Upptagen:</span>
                            <span>{user.is_occupied ? "Ja" : "Nej"}</span>
                        </div>
                        <div className="action-buttons-group">
                            <button onClick={() => setIsEditing(true)} className="action-button edit-button">Redigera</button>
                            <button onClick={handleDeleteUser} className="action-button delete-button">Ta bort användare</button> 
                        </div>
                    </>
                )}
            </div>

            <hr className="section-divider" />

            <h3>Tilldelade Uppdrag:</h3>
            {user.assigned_tasks.length === 0 ? (
                <p className="no-assigned-tasks-message">Användaren är inte tilldelad några uppdrag.</p>
            ) : (
                <div className="assigned-tasks-grid">
                    {user.assigned_tasks.map(task => (
                        <div key={task.id} className="assigned-task-card">
                            <div className="assigned-task-detail">
                                <span className="detail-label">Titel:</span>
                                <span>{task.title}</span>
                            </div>
                            <div className="assigned-task-detail">
                                <span className="detail-label">Status:</span>
                                <span>{task.status}</span>
                            </div>
                            <div className="assigned-task-detail">
                                <span className="detail-label">Starttid:</span>
                                <span>{new Date(task.start_time).toLocaleString()}</span>
                            </div>
                            <div className="assigned-task-detail">
                                <span className="detail-label">Sluttid:</span>
                                <span>{new Date(task.end_time).toLocaleString()}</span>
                            </div>
                            <div className="assigned-task-detail">
                                <span className="detail-label">Från:</span>
                                <span>{task.start_adress}</span>
                            </div>
                            <div className="assigned-task-detail">
                                <span className="detail-label">Till:</span>
                                <span>{task.destination_adress}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}