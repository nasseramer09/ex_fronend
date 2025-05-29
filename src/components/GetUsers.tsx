import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./styles/GetUsers.css";
import { apiRequest } from "../services/api";

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    role: string;
    phone_number: string;
    email: string;
    is_occupied: boolean;
}

export default function GetUsers(){
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await apiRequest<UserData[]>('/api/users/get_all_users', 'GET');
                setUsers(response);
                setError("");
            } catch (error: any) {
                setError(error.message || "Kunde inte hämta användare.");
                console.error("Fel vid hämtning av användare:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (userId: number) => {
        navigate(`/admin/users/${userId}`);
    };

    return (
        <div className="user-list-container">
            {error && <p className="user-error-message">{error}</p>}
            <h2 className="user-list-heading">Användare Lista</h2>
            
            {loading ? (
                <p className="loading-message">Laddar användare...</p>
            ) : users.length === 0 ? (
                <p className="no-data-message">Inga användare att visa.</p>
            ) : (
                <div className="user-grid">
                    {users.map((user) => (
                        <div key={user.id} className="user-card" onClick={() => handleUserClick(user.id)}>
                            <div className="user-card-header">
                                <h3>{user.first_name} {user.last_name}</h3>
                                <span className={`user-status ${user.is_occupied ? 'occupied' : 'available'}`}>
                                    {user.is_occupied ? 'Upptagen' : 'Ledig'}
                                </span>
                            </div>
                            
                            <div className="user-card-detail">
                                <span className="detail-label">Roll:</span>
                                <span>{user.role}</span>
                            </div>
                            <div className="user-card-detail">
                                <span className="detail-label">Användarnamn:</span>
                                <span>{user.username}</span>
                            </div>
                            <div className="user-card-detail">
                                <span className="detail-label"><FaPhone /></span>
                                <span>{user.phone_number}</span>
                            </div>
                            <div className="user-card-detail">
                                <span className="detail-label"><FaEnvelope /></span>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}