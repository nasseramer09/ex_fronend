import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export default function Users(){
    const [users, setUsers] = useState([]);
    const [error, setError]=useState("");


    useEffect(() =>{
        const fetchUsers = async () =>{
            try {
                const response = await fetch(`${API_BASE_URL}/api/tasks/get_all_users`,{
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
    <>
     <div className="task-container">
        <h2>Användare Lista </h2>
        {error && <p style={{color: "red"}}>{error}</p>}
    <table className="table"> 

    <thead>
      <tr>
        <th> Förnamn  </th>
        <th> Efternamn </th>
        <th> Role </th>
        <th>  <FaPhone size={24} color="white" /></th>
        <th>  <FaEnvelope size={24} color="white" /></th>
        
      </tr>
    </thead>
    <tbody id="tbody">
         {users.map((user:any)=>(
                <tr key={user.id} className="tr-limit"> 
         
     
        <td className="text-center"> {user.first_name} </td>
        <td className="text-center"> {user.last_name} </td>
        <td className="text-center"> {user.role}  </td>
        <td className="text-center"> {user.phone_number} </td>
         <td className="text-center"> {user.email}  </td>
        
      </tr>
       ))}
    </tbody>
  </table>
  </div>
    
    </>
);

}