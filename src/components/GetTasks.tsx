import { useEffect, useState } from "react";
import "./styles/GetTasks.css"
import { FaHourglass, FaTruck } from "react-icons/fa";
import { FaCheckToSlot, FaLocationDot, FaLocationPin,  } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
type Task = {
    id:number;
    title:string;
    description:string;
    car_id:number;
    start_adress:string;
    destination_adress:string;
    estimated_time:number;
    status:string;

}
export default function GetTasks(){

    const [tasks, setTasks]=useState<Task[]>([]);
    const [error, setError] = useState("");
    

    useEffect(()=>{
        const fetchTasks = async () =>{

            try{
                const response = await fetch(`${API_BASE_URL}/api/tasks/get_all_tasks`,{
                    method : 'GET',
           });

           const data = await response.json();

           if(!response.ok){
            throw new Error(data.message || "Kunde inte hämta uppdraget");
           }

           setTasks(data);

        }catch (error:any){

            setError(error.message || "Något gick fel");
            console.error("Fel vid hämtning av uppdrag");
        }
    
    };

    fetchTasks();

},[]);



    return (
        <> 
    
            
            {error && <p className="error">{error}</p>}
        
      <div className="dashboard-container">
   
                <h1> Uppdrag </h1>
                    <div className="task-grid">
                        {tasks.map((task:any)=>(

                    <div key={task.id} className="data-item"> 

                    <div className="task-block"> 
                        <span className="label"> Titel:  </span>
                        <span className="value"> {task.title} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> Beskrivning: </span>
                        <span className="value"> {task.description} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaTruck/> Antal fordon: </span>
                        <span className="value"> {task.car_id} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaLocationDot/> Startadress: </span>
                        <span className="value"> {task.start_adress} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaLocationPin/>Kund-adress:  </span>
                        <span className="value"> {task.destination_adress} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaHourglass/>Estimerad tid: </span>
                        <span className="value"> {task.estimated_time} min</span>
                    </div> 

                    <div className="task-block"> 
                        <span className="label"> <FaCheckToSlot/> Status: </span>
                        <span className={`status ${task.status}`}> {task.status} </span>
                </div>
                </div>
                ))}
            </div>
        </div>
      </>
    );
}