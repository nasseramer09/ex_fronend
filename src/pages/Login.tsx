import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mahambild from "../assets/mahambild.png"
import "./styles/login.css"


export default function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit= async (e: React.FormEvent)=>{
        e.preventDefault();
        setError(" ");

        try{
            const response = await fetch('http://127.0.0.1:5000/api/users/login',{
                method : 'POST',
                headers: {'Content-Type' : 'application/json',
            },
            body: JSON.stringify({email, password}),
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
            <img src={mahambild} alt="Maham logo" className="logo" />
            <h1> Välkommen till MAHAM </h1>
            <p> Logga in för att organisera dina uppdrag </p>

            <div className="tabs">
            <span className="tab active"> Logga in </span>
            <span className="tab"> Registrera dig </span>
            </div>

            <form onSubmit={handleSubmit} className="form">
            {error && <p className="error-message"> {error} </p>}
                <div className="input-field"> 
                <input type="email" 
                placeholder="E-postadress" 
                onChange={(e)=>setEmail(e.target.value)} 
                required />

                <input type="password" 
                placeholder="Lösenord" 
                onChange={(e)=>setPassword(e.target.value)} 
                required />
                
                </div>
                <button type="submit" className="login-button"> Logga in </button>
            </form>
        </div>
        <div className="divider">
            <span> </span><span></span>
        </div>
        <div className="right-section">
            <img src={mahambild} alt="Illustration av uppdragstruktur" />
        </div>
    </div>
)
}
