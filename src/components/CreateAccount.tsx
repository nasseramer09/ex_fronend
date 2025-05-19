import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export default function CreateAccount(){

    
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

    

    const handleCreateAccountSubmit = async ( e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (registerPassword !== registerConfermPassword){
            setError ("Lösenorden matchar inte");
            return;
        }

        try{
            const response = await fetch(`${API_BASE_URL}/api/users/create`, {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: registeremail, 
                    password_hash: registerPassword,
                    first_name:firstName,
                    last_name:lastName,
                    username: userName,
                    role:role,
                    phone_number:phoneNumber


                
                })
            });
            const data = await response.json();
            
            if (response.ok){
                navigate('/login');
                console.log("Registeration lyckades", data);
            }else{
                setError(data.message || 'Registeration misslyckades');
                console.log("Registeration misslyckades", data);
            }
        }catch(error:any){
            setError("Ett fel uppstod vid skapandet av konto ");
            console.log("FEL vid registeration: ", error)
        }
    };

return(
    <div className="container">
       <form onSubmit={handleCreateAccountSubmit} className="form" data-tab= "register">
            {error && <p className="error-message"> {error} </p>}

                <div className="input-field"> 

                <label> Förnamen
                <input type="text" 
                placeholder="Förnamn" 
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)} 
                required />
                </label>

                <label> Efternamn
                <input type="text" 
                placeholder="Efternamn" 
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)} 
                required />
                </label>

                <label>
                Användarnamn
                <input type="text" 
                placeholder="Användarnamn" 
                value={userName}
                onChange={(e)=>setUserName(e.target.value)} 
                required />
                </label>

                <label> 
                E-post adress
                <input type="email" 
                placeholder="E-postadress" 
                value={registeremail}
                onChange={(e)=>setRegisterEmail(e.target.value)} 
                required />
                </label>

                <label htmlFor="lösenord">
                Lösenord
                <input type="password" 
                placeholder="Lösenord" 
                value={registerPassword}
                onChange={(e)=>setRegisterPassword(e.target.value)} 
                required />
                </label>

                <label htmlFor="password"> 
                Bekräfta Lösenord 
                <input type="password" 
                placeholder="Bekräfta Lösenord" 
                value={registerConfermPassword}
                onChange={(e)=>setRegisterConfermPassword(e.target.value)} 
                required />
                </label>

                <label>
                    Välj roll
                    <select value={role} onChange={(e)=>setRole(e.target.value)}>
                        <option value="">Välj roll </option>
                        <option value='admin'> Admin </option>
                        <option value='personal'> Personal </option>

                    </select>
                </label>

                <label >
                    Telefonnummer (Valfritt)
                    <input type="tel"
                    placeholder="Telefonnummer"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} />
                </label>


                </div>
                <button type="submit" className="login-button"> Skapa konto </button>
            </form>
        
        
        
    </div>
)}