import React, { useEffect, useState } from "react";
import { FaUser} from "react-icons/fa";
import Select from "react-select";
import { FaLocationCrosshairs, FaLocationDot, FaSquareCheck } from "react-icons/fa6";
import "./styles/createTasks.css"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';


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


    useEffect(()=>{ 

    const fetchUsers = async ()=>{
        
        try{
            const response = await fetch(`${API_BASE_URL}/api/users/get_all_users`, {
                method:'GET',
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || "Kunde inte hämta användare");
            }

            const avaliableUsers = data.filter((user:User) => !user.is_occupied);

            setUsers(avaliableUsers);
        }catch(error:any){
            setError(error.message || "Något blev fel ");
            console.error("Något blev fel vid hämtningen av fordon");
        }
    }
    fetchUsers();
},[]);

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

            const avaliableCars = data.filter((car:Car) => !car.is_occupied);

            setCars(avaliableCars);
        }catch(error:any){
            setError(error.message || "Något blev fel ");
            console.error("Något blev fel vid hämtningen av fordon");
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
        label: `${user.first_name} (${user.last_name}) (${user.username})`
    }));


    const handleCarChange = (selectedOptions:any) =>{
        setSelectedCarOptions(selectedOptions)
    };

    const handleUserChange = (selectedOptions:any) =>{
        setSelectedUserOptions(selectedOptions)
    };

    // const handleCarSelection = async (e: React.ChangeEvent<HTMLSelectElement>)=>{
    //     const options = e.target.options;
    //     const selectedValues: number[] =[];

    //     for (let i =0; i < options.length; i++){
    //         if (options[i].selected){
    //             selectedValues.push(Number(options[i].value))
    //         }
    //     }

    //     setSelectedCarIds(selectedValues);
    // }

    // const handleUserSelection = async (e: React.ChangeEvent<HTMLSelectElement>)=>{
    //     const options = e.target.options;
    //     const selectedValues: number[] =[];

    //     for (let i = 0; i < options.length; i++){
    //         if (options[i].selected){
    //             selectedValues.push(Number(options[i].value))
    //         }
    //     }

    //     setSelectedUserIds(selectedValues);
    // }




    const handleCreateTask = async (e: React.FormEvent)=>{
        e.preventDefault();
        setError("");

        const carIdsToSend = selectedCarOptions ? selectedCarOptions.map(option=> option.value):[];
        const userIdsToSend = selectedUserOptions ? selectedUserOptions.map(option=> option.value):[];
        

        if (carIdsToSend.length === 0){
            setError("Minnst ett fordon måste tilldelas uppgiften. ");
        }

        if (userIdsToSend.length === 0){
            setError("Minnst ett perosnal måste tilldelas uppgiften. ");
        }

        try{
            const response = await fetch(`${API_BASE_URL}/api/tasks/create_task`, {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: title,
                    description:description,
                    car_ids:carIdsToSend,
                    assigned_users:userIdsToSend,
                    start_time:startTime,
                    end_time:endTime,
                    start_adress:startadress,
                    destination_adress:destinationAdress,
                    status: status || 'planerat',
                })
            });
            const data = await response.json();

            if (response.ok){
                console.log("Uppdraget skapat", data);
                setTitle("");
                setDescription("");
                setSelectedCarOptions([]);
                setSelectedUserOptions([]);
                setStartadress("");
                setDestinationAdress("");
                setStartTime("")
                setEndTime("")
                window.location.reload();
                alert("uppgift har skapats! ")
            }else{
                setError(data.message || 'Kunde inte skapa uppdraget');
                console.log( "Kunde inte skapa uppdraget", data)
            }
        }catch(error:any){
            setError("Fel vid skapandet av uppdrag " + error.message)
            console.log("Fel vid skapandet av uppdrag ", error)
        }
    };

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
            <Select isMulti
            options={carOptions}
            value={selectedCarOptions}
            onChange={handleCarChange}
            placeholder="Tilldela en eller flera fordon"
            className="react-select-coantiner"
            classNamePrefix="react-select"/>
        </label>
        

        <label>
            <FaUser/>Tilldela användare:
            <Select isMulti
            options={userOptions}
            value={selectedUserOptions}
            onChange={handleUserChange}
            placeholder="Tilldela en eller flera användare"
            className="react-select-coantiner"
            classNamePrefix="react-select"/>
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