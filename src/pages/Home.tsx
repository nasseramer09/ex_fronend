import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./styles/home.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
type Task = {
    id:number;
    title:string;
    description:string;
    car_id:number[];
    start_adress:number[];
    destination_adress:string;
    estimated_time:number;
    status:string;
    start_time:string;
    end_time:string;
}

export default function Home(){

const [error, setError] = useState("");
  const [tasks, setTasks]=useState<Task[]>([]);


useEffect(()=>{ 

    const fetchCars = async ()=>{
        
        try{
            const response = await fetch(`${API_BASE_URL}/api/tasks/get_all_tasks`, {
                method:'GET',
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || "Kunde inte hämta uppgift");
            }

            setTasks(data)

        }catch(error:any){
            setError(error.message || "Något blev fel ");
            console.error("Något blev fel vid hämtningen av uppgift");
        }
    }
    fetchCars();
},[]);

 const planeradTasksCount = tasks.filter(tasks => tasks.status === 'planerat' || tasks.status === 'pågående').length
 const totalUppdrag = tasks.length;
    return(
      <> 

        {error && <p className="error">{error}</p>}

    <div className="dashboard-container">
    <Layout children={undefined}></Layout>

     <div className="row">
        
       <div className="card">
            <h4> Totalt uppdrag </h4>
            <p id="totalUppdrag"> {totalUppdrag}</p>
          </div><div className="card">
              <h4> Activa uppdrag </h4>
              <p id="activaUppdrag"> {planeradTasksCount} </p>
            </div>  
    </div>

    <div className="task-container">
    <table className="table"> 

    <thead>
      <tr>
        <th> Title </th>
        <th> Status </th>
        <th> Deadline </th>
      </tr>
    </thead>
    <tbody id="tbody">
      {tasks.map(task=>(
         <tr key={task.id}>
        <td className="text-center"> {task.title} </td>
        <td className="text-center"> {task.status}  </td>
        <td className="text-center"> {task.end_time}  </td>
      </tr>
      ))}

      {tasks.length === 0 && (
        <tr>
          <td colSpan={3} className="text-center"> Inga uppdrag att vissa </td>
        </tr>
      )}
     
    </tbody>
  </table>
  
  </div>
  
  </div>
</>

);
}