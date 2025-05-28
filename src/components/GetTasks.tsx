import { useEffect, useState } from "react";
import "./styles/GetTasks.css"
import { FaTruck, FaUser } from "react-icons/fa";
import { FaCheckToSlot, FaLocationDot, FaLocationPin,  } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
type UserDetail={

    id:number;
    username:string;
    first_name:string;
    last_name:string;
}

type CarDetail={

    id:number;
    model:string;
    license_plate:string;
    status:string;
    is_occupied:boolean
}

type Task = {
    id:number;
    title:string;
    description:string;
    car_ids:number[];
    assigned_users:number[];
    assigned_users_details:UserDetail[];
    car_details:CarDetail[];
    start_adress:string;
    destination_adress:string;
    status:string;
    start_time:string;
    end_time:string;

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
           console.log('reposne data', data)

           if(!response.ok){
            throw new Error(data.message || "Kunde inte hämta uppdraget");
           }

           setTasks(data);

        }catch (error:any){

            setError(error.message || "Något gick fel");
           
        }
    
    };

    fetchTasks();

},[]);

const handleCancelTask = async(taskId:number)=>{
    if(!window.confirm("Är du säker på att du vill avbryta uppdraget? ")){
        return;
    }

    setError("");
    try{
        const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({status:'avbrutet' }),
        });

        const data = await response.json();
        

        if(!response.ok){
            throw new Error(data.message || "Kunde inte avbryta uppgiften ");
        }

        setTasks(prevTasks => 
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: 'avbrutet'}: task
        )
    );
    alert("Uppdraget har avbrutits ");
    } catch(error: any){
        setError(error.message || "Något gick fel vid avnrytandet av uppdrag. ");
        console.error("Fel vid avbrytande av uppdraget: ", error);
    }
}


    const timeFormat =(isoString:string)=>{
        const date = new Date(isoString);
        return date.toLocaleString('sv-SE', {
            year:'numeric',
            month:'2-digit',
            day:'2-digit',
            hour:'2-digit',
            minute:'2-digit',
            hour12:false
        }).replace(/\//g, '-')
    };

    const navigate = useNavigate();

    const handleCardClick = (taskId:number)=>{
         navigate(`/tasks/${taskId}/edit`);
    };


    return (
        <> 
    
            
            {error && <p className="error">{error}</p>}
        
      <div className="dashboard-container">
   
                <h1> Alla Uppdrag </h1>
                    <div className="task-grid">
                        {tasks.length === 0 && !error ? (
                            <p style={{gridColumn: '1 / -1', textAlign:'center', color: '#555'}}> Laddar Uppdrag eller inga uppdrag att vissa </p>
                        ):(
                        tasks.map((task:Task)=>(

                    <div key={task.id} className="data-item"
                        onClick={()=>handleCardClick(task.id)}
                    > 

                    <div className="task-header"> 
                        <h3>   {task.title} </h3>
                        <p>{task.description}</p>

                    </div>
                    
                    <div className="task-block"> 
                        <span className="label">  Start </span>
                        <span className="value"> {timeFormat(task.start_time)} </span>
                    </div>


                     <div className="task-block"> 
                        <span className="label">  Slut </span>
                        <span className="value"> {timeFormat(task.end_time)} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaUser/> Personal : </span>
                        <span className="value"> {Array.isArray(task.assigned_users_details) && task.assigned_users_details.length > 0 ? (
                            task.assigned_users_details.map((user:UserDetail) =>
                                `${user.first_name} ${user.last_name}`
                            ).join(', ')
                        ):("Ingen tilldelad")} </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaTruck/> Fordon: </span>
                        <span className="value"> {Array.isArray(task.car_details) && task.car_details.length > 0 ?(
                            task.car_details.map((car:CarDetail)=>
                            `${car.model} (${car.license_plate})`
                        ).join(', ')
                        ):("Inget fordon att tilldela")} 
                        </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaLocationDot/> Startadress: </span>
                        <span className="value"> {task.start_adress } </span>
                    </div>

                    <div className="task-block"> 
                        <span className="label"> <FaLocationPin/>Kundadress:  </span>
                        <span className="value"> {task.destination_adress} </span>
                    </div>


                    <div className="task-block"> 
                        <span className="label"> <FaCheckToSlot/> Status: </span>
                        <span className={`status ${task.status}`}> {task.status} </span>
                </div>

                    <div className="task-block"> 
                        {task.status !== 'avbrutet' && task.status !== 'klart' &&(
                             <button
                             onClick={(e)=>{e.stopPropagation(); handleCancelTask(task.id);}} className="cancel-button">
                            Avbryt </button>
                        )}
                </div>
                </div>
                        ))
                )}
                
            </div>
        </div>
      </>
    );
}

