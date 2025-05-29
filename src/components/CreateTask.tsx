import React, { useEffect, useState } from "react";
import { FaUser} from "react-icons/fa";
import Select from "react-select";
import { FaLocationCrosshairs, FaLocationDot, FaSquareCheck } from "react-icons/fa6";
import "./styles/createTasks.css"
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

type Car = {
    id:number;
    model:string;
    license_plate:string;
    status:string;
    is_occupied:boolean
}


type User = {
    id:number;
    first_name:string;
    last_name:string;
    username:string;
    is_occupied:boolean;
}

type SelectOption = {
    value : number;
    label: string;
}

export default function CreateTask(){

    const[cars, setCars] = useState<Car[]>([]);
    const[users, setUsers] = useState<User[]>([]);

    const[title, setTitle]=useState("");
    const[description, setDescription]=useState("");
    const[selectedCarOptions, setSelectedCarOptions] = useState<SelectOption[]>([]);
    const[selectedUserOptions, setSelectedUserOptions] = useState<SelectOption[]>([]);
    const[startadress, setStartadress]=useState("");
    const[destinationAdress, setDestinationAdress]=useState("");
    const[startTime, setStartTime]=useState("");
    const[endTime, setEndTime]=useState("");
    const[status, setStatus]=useState("");
    const[error, setError]=useState("");

    const navigate = useNavigate();

    useEffect(()=>{ 
        const fetchUsers = async ()=>{
            try{
                const data = await apiRequest<User[]>('/api/users/get_all_users', 'GET');
                console.log('Raw user data:', data);
                
                if (!Array.isArray(data)) {
                    console.error('User data is not an array:', data);
                    return;
                }
                
                const avaliableUsers = data.filter((user:User) => !user.is_occupied);
                console.log('Filtered users:', avaliableUsers);
                
                setUsers(avaliableUsers);
            }catch(error:any){
                console.error('Error fetching users:', error);
                setError(error.message || "Något blev fel vid hämtning av användare");
            }
        }
        fetchUsers();
    },[]);

    useEffect(()=>{ 
        const fetchCars = async ()=>{
            try{
                const data = await apiRequest<Car[]>('/api/cars/get_all_cars', 'GET');
                console.log('Raw car data:', data);
                
                if (!Array.isArray(data)) {
                    console.error('Car data is not an array:', data);
                    return;
                }
                
                const avaliableCars = data.filter((car:Car) => !car.is_occupied);
                console.log('Filtered cars:', avaliableCars);
                
                setCars(avaliableCars);
            }catch(error:any){
                console.error('Error fetching cars:', error);
                setError(error.message || "Något blev fel vid hämtning av fordon");
            }
        }
        fetchCars();
    },[]);



    const carOptions: SelectOption[] = cars.map(car=>({
        value: car.id,
        label: `${car.model} (${car.license_plate})`
    }));

    const userOptions: SelectOption[] = users.map(user=>({
        value: user.id,
        label: `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()} (${user.username})`
    }));


    const handleCarChange = (selectedOptions:any) =>{
        setSelectedCarOptions(selectedOptions)
    };

    const handleUserChange = (selectedOptions:any) =>{
        setSelectedUserOptions(selectedOptions)
    };


    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !description || !startTime || !endTime || !startadress || !destinationAdress) {
            setError("Alla fält måste fyllas i");
            return;
        }

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        if (startDate >= endDate) {
            setError("Sluttiden måste vara efter starttiden");
            return;
        }

        try {
            const taskData = {
                title,
                description,
                car_ids: selectedCarOptions.map(option => option.value),
                assigned_users: selectedUserOptions.map(option => option.value),
                start_time: startTime,
                end_time: endTime,
                start_adress: startadress,
                destination_adress: destinationAdress,
                status: status || 'planerat'
            };

            const response = await apiRequest('/api/tasks/create_task', 'POST', {
                body: taskData
            });

            
            setTitle("");
            setDescription("");
            setSelectedCarOptions([]);
            setSelectedUserOptions([]);
            setStartadress("");
            setDestinationAdress("");
            setStartTime("");
            setEndTime("");
            setStatus("");

           
            alert("Uppgiften har skapats!");
            navigate('/adminPanel');
            
        } catch (error: any) {
            if (error.message?.includes('created') || error.message?.includes('success')) {
                alert("Uppgiften har skapats!");
                navigate('/adminPanel');
            } else {
                setError(error.message || "Ett oväntat fel uppstod vid skapandet av uppgiften");
                console.error("Error creating task:", error);
            }
        }
    };

    console.log('Current state:', {
        cars,
        users,
        carOptions,
        userOptions,
        selectedCarOptions,
        selectedUserOptions
    });

    return (

        <>
         <div className="createTask-container">
        {error && <p className="error-message"> {error} </p>}

        <h1> Skapa uppdrag </h1>

       <form onSubmit={handleCreateTask}> 

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

        <label>Starttid
            <input type="datetime-local"
             value={startTime}
             onChange={(e)=>setStartTime(e.target.value)} />
        </label>


        <label>Sluttid
            <input type="datetime-local"
             value={endTime}
             onChange={(e)=>setEndTime(e.target.value)} />
        </label>

        
         <label>
            välj fordon:
            <Select 
                isMulti
                options={carOptions}
                value={selectedCarOptions}
                onChange={handleCarChange}
                placeholder="Tilldela en eller flera fordon"
                className="react-select-coantiner"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Inga fordon tillgängliga"}
            />
        </label>
        

        <label>
            <FaUser/>Tilldela användare:
            <Select 
                isMulti
                options={userOptions}
                value={selectedUserOptions}
                onChange={handleUserChange}
                placeholder="Tilldela en eller flera användare"
                className="react-select-coantiner"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Inga användare tillgängliga"}
            />
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


         <label>
            <FaSquareCheck/> Status
            <select value={status} onChange={(e)=>setStatus(e.target.value)} required>
                        <option value="">-- Välj Status --</option>
                        <option value='planerat'> Planerat </option>
                        <option value='pågående'> Pågående </option>
                        <option value='klart'> Klart </option>
                        <option value='avbrutet'> avbrutet </option>

                    </select>
         </label>

                <button className="createTask-button" type="submit"> Skapa </button>
</form>
        </div>
        </>
    )

}