import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"
import "./styles/login.css"
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export default function Login(){
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {login} = useAuth()

    const handleLoginSubmit= async (e: React.FormEvent)=>{
        e.preventDefault();
        setError("");

        try{
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method : 'POST',
                headers: {'Content-Type' : 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (response.ok){
            login(data.access_token, data.user_role, data.user_id)
            navigate('/home');
        } else {
            setError(data.message || 'Inloggning misslyckades' );
            console.error("Inloggningen misslyckades ", data);
        }
      
    } catch (error: any){
        setError("Ett fel uppstod vid inloggning");
        console.error("Fel vid inloggning: ", error)
    }
    };

return(
    <div className="container">
        <div className="left-section">
            <img src={logo} alt="Maham logo" className="logo" />
            <h1> Välkommen till MAHAM </h1>
            <p> Logga in för att organisera dina uppdrag </p>

            <form onSubmit={handleLoginSubmit} className="form">

            {error && <p className="error-message"> {error} </p>}

            <div className="input-field"> 
                <input type="email" 
                placeholder="E-postadress" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
                required />

                <input type="password" 
                placeholder="Lösenord" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                required />
                </div>
                <button type="submit" className="login-button"> Logga in </button>
            </form>
        </div>
    </div>
)
}
