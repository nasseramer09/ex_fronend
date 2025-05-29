import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function CreateAccount() {
    const [registeremail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfermPassword, setRegisterConfermPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreateAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (registerPassword !== registerConfermPassword) {
            setError("Lösenorden matchar inte");
            return;
        }

        if (!firstName || !lastName || !userName || !registeremail || !registerPassword || !role) {
            setError("Alla fält måste fyllas i");
            return;
        }

        try {
            console.log('Creating account with data:', {
                email: registeremail,
                password: registerPassword,
                first_name: firstName,
                last_name: lastName,
                username: userName,
                role: role,
                phone_number: phoneNumber || null
            });

            const response = await apiRequest('/api/users/create', 'POST', {
                body: {
                    email: registeremail,
                    password: registerPassword,
                    first_name: firstName,
                    last_name: lastName,
                    username: userName,
                    role: role,
                    phone_number: phoneNumber || null
                }
            });

            console.log("Registration successful:", response);
            navigate('/login');
        } catch (error: any) {
            console.error("Registration error:", error);
            setError(error.message || "Ett fel uppstod vid skapandet av konto");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleCreateAccountSubmit} className="form" data-tab="register">
                {error && <p className="error-message">{error}</p>}

                <div className="input-field">
                    <label>
                        Förnamn
                        <input
                            type="text"
                            placeholder="Förnamn"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            autoComplete="given-name"
                        />
                    </label>

                    <label>
                        Efternamn
                        <input
                            type="text"
                            placeholder="Efternamn"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            autoComplete="family-name"
                        />
                    </label>

                    <label>
                        Användarnamn
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </label>

                    <label>
                        E-post adress
                        <input
                            type="email"
                            placeholder="E-postadress"
                            value={registeremail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Lösenord
                        <input
                            type="password"
                            placeholder="Lösenord"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </label>

                    <label>
                        Bekräfta Lösenord
                        <input
                            type="password"
                            placeholder="Bekräfta Lösenord"
                            value={registerConfermPassword}
                            onChange={(e) => setRegisterConfermPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </label>

                    <label>
                        Välj roll
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Välj roll</option>
                            <option value="admin">Admin</option>
                            <option value="personal">Personal</option>
                        </select>
                    </label>

                    <label>
                        Telefonnummer (Valfritt)
                        <input
                            type="tel"
                            placeholder="Telefonnummer"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            autoComplete="tel"
                        />
                    </label>
                </div>
                <button type="submit" className="login-button">Skapa konto</button>
            </form>
        </div>
    );
}