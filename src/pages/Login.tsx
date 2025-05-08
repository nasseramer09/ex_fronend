import React, { useState } from "react";
import mahambild from "../assets/mahambild.png"
import "./styles/login.css"


export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit= async (e: React.FormEvent)=>{
        e.preventDefault();
        console.log("Email", email, "Password", password)
      
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
                <div className="input-field"> 
                <input type="email" placeholder="E-postadress" onChange={(e)=>setEmail(e.target.value)} required />
                <input type="password" placeholder="Lösenord" onChange={(e)=>setPassword(e.target.value)} required />
                
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
