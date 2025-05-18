import { useEffect, useState } from "react";
import { FaHourglassHalf} from "react-icons/fa";
import { FaLocationCrosshairs, FaLocationDot, FaSquareCheck } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';


type Cars = {
    id:number;
    model:string;
    license_number:string;
    status:string;

}

export default function CreateTask(){

    const[cars, setCars] = useState<Cars[]>([]);

    const[title, setTitle]=useState("");
    const[description, setDescription]=useState("");
    const[carId, setCarId]=useState("");
    const[startadress, setStartadress]=useState("");
    const[destinationAdress, setDestinationAdress]=useState("");
    const[estimatedTime, setEstimatedTime]=useState("");
    const[status, setStatus]=useState("");
    const[error, setError]=useState("");


    useEffect(()=>{ 

    const fetchCars = async ()=>{
        
        try{
            const response = await fetch(`${API_BASE_URL}/api/cars/get_all_cars`, {
                method:'GET',
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || "Kunde inte hämta fordon");
            }

            const avaliableCars = data.filter((car:Cars)=> car.status === "ledig");

            setCars(avaliableCars);
        }catch(error:any){
            setError(error.message || "Något blev fel ");
            console.log("Något blev fel vid hämtningen av fordon");
        }
    }
    fetchCars();
},[]);


    const handleCreateTask = async (e: React.FormEvent)=>{
        e.preventDefault();
        setError("");

        try{
            const response = await fetch(`${API_BASE_URL}api/tasks/create_task`, {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: title,
                    description:description,
                    car_id:carId,
                    start_adress:startadress,
                    destination_adress:destinationAdress,
                    estimated_time:estimatedTime,
                    status:status,
                })
            });
            const data = await response.json();

            if (response.ok){
                console.log("Uppdraget skapat", data);
            }else{
                setError(data.message || 'Kunde inte skapa uppdraget');
                console.log( "Kunde inte skapa uppdraget")
            }
        }catch{
            setError("Fel vid skapandet av uppdrag ")
            console.log("Fel vid skapandet av uppdrag ", error)
        }
    };

    return (

        <>
         <div className="createTask-container">
        {error && <p className="error-message"> {error} </p>}

        <h1> Create Task </h1>

       
        <label>Title
            <input type="text"
             placeholder="Title"
             value={title}
             onChange={(e)=>setTitle(e.target.value)} required/>
        </label>

         <label>Beskrivning
            <input type="text"
             placeholder="Beskrivning"
             value={description}
             onChange={(e)=>setDescription(e.target.value)} />
        </label>
        
         <label>
            välj fordon:
            <select value={carId} onChange={(e)=>setCarId(e.target.value)}>
                <option value="">-- Välj fordon --</option>
                {cars.map(car=>(
                    <option key={car.id} value={car.id}>
                        {car.model}({car.license_number})
                </option>
                ))}
            </select>
        </label>


          <label> <FaLocationDot/> Startadress
            <input type="text"
             placeholder="Drottninggatan 4b Kungsör 73633"
             value={startadress}
             onChange={(e)=>setStartadress(e.target.value)} required />
        </label>

            
        <label><FaLocationCrosshairs/> Kundadress
            <input type="text"
             placeholder="Kungsgatan 12 c 73630 Stockholm"
             value={destinationAdress}
             onChange={(e)=>setDestinationAdress(e.target.value)} required />
        </label>


         <label><FaHourglassHalf/> Estimaerad tid i minuter
            <input type="number"
             placeholder="90"
             value={estimatedTime}
             onChange={(e)=>setEstimatedTime(e.target.value)} required /> 
        </label>

         <label>
            <FaSquareCheck/> Status
            <select value={status} onChange={(e)=>setStatus(e.target.value)} required>
                        <option value="">-- Välj Status --</option>
                        <option value='planerat'> Planerat </option>
                        <option value='pågående'> Pågående </option>
                        <option value='klart'> Klart </option>

                    </select>
         </label>

                <button className="createTask-button" type="submit" onClick={handleCreateTask}> Skapa </button>

        </div>
        </>
    )

}