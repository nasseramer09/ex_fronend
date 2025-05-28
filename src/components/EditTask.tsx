import { useEffect, useState } from "react";
import "./styles/editTask.css"
import { FaTruck, FaUser } from "react-icons/fa";
import { FaCheckToSlot, FaLocationDot, FaLocationPin,  } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

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
export default function EditTask(){

    const { taskId } = useParams<{taskId:string}>();
    const taskIdNum = Number(taskId);
    const navigate = useNavigate();

    const [task, setTask]=useState<Task|null >(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Task>>({});
    const [avaliableUsers, setAvaliableUsers] = useState<UserDetail[]>([]);
    const [availableCars, setAvaliableCars] = useState<CarDetail[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");

    

    useEffect(()=>{
        const fetchData = async () =>{

            try{
                const taskResponse = await fetch(`${API_BASE_URL}/api/tasks/${taskIdNum}`);
                const taskData = await taskResponse.json();

           if(!taskResponse.ok){
            throw new Error(taskData.message || "Kunde inte hämta uppdraget");
           }

           setTask(taskData);
           setFormData(taskData);

        const userResponse = await fetch(`${API_BASE_URL}/api/users/get_all_users`);
        const usersData = await userResponse.json();
        
        if(!userResponse.ok) {
            throw new Error(usersData.message || "Kunde inte hämta användare");
        }
        
        setAvaliableUsers(usersData);

            const carResponse = await fetch(`${API_BASE_URL}/api/cars/get_all_cars`);
            const carsData = await carResponse.json();

           if(!carResponse.ok){
            throw new Error(carsData.message || "Kunde inte hämta uppdraget");
           }

           setAvaliableCars(carsData);

           

        }catch (error:any){

            setError(error.message || "Något gick fel vid hämtniong av data i edittask");
            console.error("Fel vid hämtning EditTask", error);
        }finally{
            setLoading(false);
        }
    
    };

    fetchData();

},[]);

    const timeFormat =(isoString:string | Date | null) => {
        if(!isoString) return "Inte satt"
        const date = new Date(isoString);

        if (isNaN(date.getTime())){
            console.warn("Ogiltigt datumformat:", isoString);
            return "Ogiltig datum"
        }
        return date.toLocaleString('sv-SE', {
            year:'numeric',
            month:'2-digit',
            day:'2-digit',
            hour:'2-digit',
            minute:'2-digit',
            hour12:false
        }).replace(/\//g, '-')
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
        const {name, value} = e.target;
        setFormData(prev =>({...prev, [name]:value}))
    };


    const handleAddUser = (userId:number) => {
        setFormData(prev => {
            const currentAssignedIds = new Set(prev.assigned_users || []);
            if(!currentAssignedIds.has(userId)){
                const updatedAssignedUsers = [...(prev.assigned_users || []), userId];
                const updatedAssignedUserDetails = avaliableUsers.filter(user => updatedAssignedUsers.includes(user.id));
                return{
                    ...prev,
                    assigned_users:updatedAssignedUsers,
                    assigned_users_details:updatedAssignedUserDetails,

                };
            }
            return prev;
        });
    };

    const handleRemoveUser = (userId:number) => {
        setFormData(prev => {
            
                const updatedAssignedUsers = (prev.assigned_users || []).filter(id=>id !== userId);
                const updatedAssignedUserDetails = avaliableUsers.filter(user => updatedAssignedUsers.includes(user.id));
                return{
                    ...prev,
                    assigned_users:updatedAssignedUsers,
                    assigned_users_details:updatedAssignedUserDetails,
                };
        });
    };


    const handleAddCar = (carId: number) => {
        setFormData(prev => {
            const currentAssignedIds = new Set(prev.car_ids || []);
            if (!currentAssignedIds.has(carId)) {
                const updatedCarIds = [...(prev.car_ids || []), carId];
                const updatedCarDetails = availableCars.filter(car => updatedCarIds.includes(car.id));
                return {
                    ...prev,
                    car_ids: updatedCarIds,
                    car_details: updatedCarDetails,
                };
            }
            return prev;
        });
    };

    const handleRemoveCar = (carId: number) => {
        setFormData(prev => {
            const updatedCarIds = (prev.car_ids || []).filter(id => id !== carId);
            const updatedCarDetails = availableCars.filter(car => updatedCarIds.includes(car.id));
            return {
                ...prev,
                car_ids: updatedCarIds,
                car_details: updatedCarDetails,
            };
        });
    };


     const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(""); 
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${taskIdNum}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Kunde inte uppdatera uppdraget.");
            }

            setTask(result); 
            setIsEditing(false); 
            alert("Uppdraget uppdaterades framgångsrikt!");

        } catch (err: any) {
            setError(err.message || "Något gick fel vid uppdatering.");
            console.error("Fel vid uppdatering av uppdrag:", err);
        }
    };


    const handleCancel = () => {
        setIsEditing(false);
        setFormData(task || {});
    };

    if (loading) {
        return <div className="loading">Laddar uppdrag...</div>;
    }

    if (error) {
        return <div className="error">Fel: {error}</div>;
    }

    if (!task) {
        return <div className="not-found">Uppdraget hittades inte.</div>;
    }


     return (
        <div className="edit-task-container">
            <h1>Uppdrag: {task.title}</h1>

            <div className="task-actions">
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)}>Redigera</button>
                ) : (
                    <>
                        <button onClick={handleSave} className="save-button">Spara</button>
                        <button onClick={handleCancel} className="cancel-button">Avbryt</button>
                    </>
                )}
                 
                 <button onClick={() => navigate('/adminPanel')} className="back-button">Tillbaka till Dashboard</button>
            </div>

            {isEditing ? (
               
                <form onSubmit={handleSave} className="task-form">
                    <div className="form-group">
                        <label>Titel:</label>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Beskrivning:</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Starttid:</label>
                        <input type="datetime-local" name="start_time" value={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Sluttid:</label>
                        <input type="datetime-local" name="end_time" value={formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 16) : ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Startadress:</label>
                        <input type="text" name="start_adress" value={formData.start_adress || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Kundadress:</label>
                        <input type="text" name="destination_adress" value={formData.destination_adress || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select name="status" value={formData.status || ''} onChange={handleChange}>
                            <option value="planerat">Planerat</option>
                            <option value="pågående">Pågående</option>
                            <option value="klart">Klart</option>
                            <option value="avbrutet">Avbrutet</option>
                        </select>
                    </div>

                    
                    <div className="form-section">
                        <h3><FaUser /> Tilldelad Personal:</h3>
                        <div className="assigned-list">
                            {formData.assigned_users_details && formData.assigned_users_details.length > 0 ? (
                                formData.assigned_users_details.map(user => (
                                    <div key={user.id} className="assigned-item">
                                        {user.first_name} {user.last_name}
                                        <button type="button" onClick={() => handleRemoveUser(user.id)} className="remove-button">X</button>
                                    </div>
                                ))
                            ) : (
                                <p>Ingen personal tilldelad.</p>
                            )}
                        </div>
                        <div className="add-item-control">
                            <select onChange={(e) => handleAddUser(Number(e.target.value))} defaultValue="">
                                <option value="" disabled>Välj personal att lägga till</option>
                                {avaliableUsers.map(user => (
                                    !(formData.assigned_users || []).includes(user.id) && (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name} ({user.username})
                                        </option>
                                    )
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><FaTruck /> Tilldelade Fordon:</h3>
                        <div className="assigned-list">
                            {formData.car_details && formData.car_details.length > 0 ? (
                                formData.car_details.map(car => (
                                    <div key={car.id} className="assigned-item">
                                        {car.model} ({car.license_plate})
                                        <button type="button" onClick={() => handleRemoveCar(car.id)} className="remove-button">X</button>
                                    </div>
                                ))
                            ) : (
                                <p>Inget fordon tilldelat.</p>
                            )}
                        </div>
                        <div className="add-item-control">
                            <select onChange={(e) => handleAddCar(Number(e.target.value))} defaultValue="">
                                <option value="" disabled>Välj fordon att lägga till</option>
                                {availableCars.map(car => (
                                    !(formData.car_ids || []).includes(car.id) && (
                                        <option key={car.id} value={car.id}>
                                            {car.model} ({car.license_plate})
                                        </option>
                                    )
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            ) : (
               
                <div className="task-details-view">
                    <div className="detail-row">
                        <span className="label">Titel:</span>
                        <span className="value">{task.title}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Beskrivning:</span>
                        <span className="value">{task.description}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label"><FaUser /> Personal:</span>
                        <span className="value">
                            {Array.isArray(task.assigned_users_details) && task.assigned_users_details.length > 0 ? (
                                task.assigned_users_details.map(user =>
                                    `${user.first_name} ${user.last_name}`
                                ).join(', ')
                            ) : ("Ingen tilldelad")}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label"><FaTruck /> Fordon:</span>
                        <span className="value">
                            {Array.isArray(task.car_details) && task.car_details.length > 0 ? (
                                task.car_details.map(car =>
                                    `${car.model} (${car.license_plate})`
                                ).join(', ')
                            ) : ("Inget fordon att tilldela")}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label"><FaLocationDot /> Startadress:</span>
                        <span className="value">{task.start_adress}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label"><FaLocationPin /> Kundadress:</span>
                        <span className="value">{task.destination_adress}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Starttid:</span>
                        <span className="value">{timeFormat(task.start_time)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Sluttid:</span>
                        <span className="value">{timeFormat(task.end_time)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label"><FaCheckToSlot /> Status:</span>
                        <span className={`status ${task.status}`}>{task.status}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

