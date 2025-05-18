import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
import "./styles/tasks.css"

export default function Users(){
    const [users, setUsers] = useState([]);
    const [error, setError]=useState("");


    useEffect(() =>{
        const fetchUsers = async () =>{
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/get_all_users`,{
                    method: 'GET',
                });

                const data = await response.json();

                if(!response.ok){
                        throw new Error(data.message || "Kunde inte hämta användarna");
                    }

                    setUsers(data);
            }catch (error:any){
                    setError(error.message || "Något gick fel");
                    console.error("Fel vid hämtning av användare")
                }
        };

            fetchUsers();
}, []);

return(
   
  <div className="container">
        
        {error && <p className="error">{error}</p>}
    <div className="data-list">
<h2> Användare Lista </h2>
{users.map((user:any)=>(
      <div key={user.id} className="data-item"> 

            
          <div className="data-pair">
              <span className="data-label"> Förnamn:  </span>
              <span> {user.first_name} </span>
          </div>

          <div className="data-pair">
              <span className="data-label"> Efternamn:  </span>
              <span> {user.last_name} </span>
          </div>
          
          <div className="data-pair">
              <span className="data-label"> Role:  </span>
              <span> {user.role} </span>
          </div>
      
          <div className="data-pair">
              <span className="data-label"> <FaPhone/>  </span>
              <span> {user.phone_number} </span>
          </div>

          <div className="data-pair">
              <span className="data-label"> <FaEnvelope/>  </span>
              <span> {user.email} </span>
          </div>
        
      </div>
       ))}
    </div>
  </div>
    
);

}