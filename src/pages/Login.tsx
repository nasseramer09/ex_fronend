import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"
import "./styles/login.css"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export default function Login(){
    
    
    const [loginemail, setLoginEmail] = useState("");
    const [loginpassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


   

    const handleLoginSubmit= async (e: React.FormEvent)=>{
        e.preventDefault();
        setError(" ");

        try{
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method : 'POST',
                headers: {'Content-Type' : 'application/json',
            },
            body: JSON.stringify({email: loginemail, password: loginpassword}),
        });

        const data = await response.json();

        if (response.ok){
            localStorage.setItem('accessToken', data.access_token);
            navigate('/home');
            console.log("Inloggning lyckades", data)
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
                value={loginemail}
                onChange={(e)=>setLoginEmail(e.target.value)} 
                required />

                <input type="password" 
                placeholder="Lösenord" 
                value={loginpassword}
                onChange={(e)=>setLoginPassword(e.target.value)} 
                required />
                </div>
                <button type="submit" className="login-button"> Logga in </button>
            </form>
        
        

        
        </div>
        
    </div>
)
}
