import { useEffect, useState } from "react";

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
export default function Tasks(){

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

            setError(error.message || "Något gick fel")
            console.error("Fel vid hämtning av uppdrag")
        }
    
    };

    fetchTasks();

},[]);



    return (
        <>
             <div className="task-container">
                <h2> Uppdrag  </h2>
                {error && <p style={{color: "red"}}>{error}</p>}
            <table className="table"> 
        
            <thead>
              <tr>
                <th> Title  </th>
                <th> Description </th>
                <th> Fordon i tjänst </th>
                <th> Start adress </th>
                <th> Kund adress </th>
                <th>  Estimaerad tid </th>
                <th>  Status </th>
                
                
              </tr>
            </thead>
            <tbody id="tbody">
                 {tasks.map((task)=>(
                        <tr key={task.id} className="tr-limit"> 
                 
             
                <td className="text-center"> {task.title} </td>
                <td className="text-center"> {task.description} </td>
                <td className="text-center"> {task.car_id}  </td>
                <td className="text-center"> {task.start_adress}  </td>
                <td className="text-center"> {task.destination_adress} </td>
                 <td className="text-center"> {task.estimated_time}  </td>
                 <td className="text-center"> {task.status}  </td>
                
              </tr>
               ))}
            </tbody>
          </table>
          </div>
            
            </>
    );
}