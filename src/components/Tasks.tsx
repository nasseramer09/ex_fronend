import { useState } from "react";
import "./styles/tasks.css"
import { FaPlus } from "react-icons/fa";
import GetTasks from "./GetTasks";
import CreateTask from "./CreateTask";


export default function Tasks(){

    
    const [activeTab, setActiveTab] = useState("tasks");

    const renderTab = ()=>{

        switch (activeTab){
            case "tasks":
                return <GetTasks/>;
            
            case "create":
                return <CreateTask/>
            
            default:
                <GetTasks/>;
        }
}

return (
        <> 

        <div className="buttonWrapper">
        
      <div className="taskTab-buttons">
         <button className={`tablink ${activeTab==="tasks" ? "active" : " "}`}
         onClick={()=>setActiveTab("tasks")}> Se uppdrag </button>
      </div>



    <div className="taskTab-buttons">
         <button className={`tablink ${activeTab==="create" ? "active" : " "}`}
         onClick={()=>setActiveTab("create")}> <FaPlus/> </button>
      </div> 
 </div>

      <div className="taskTabContent"> {renderTab()}</div>
      </>
    );
}