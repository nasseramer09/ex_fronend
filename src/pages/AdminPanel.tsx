import { useState } from "react";
import CreateAccount from "../components/CreateAccount";
import Layout from "../components/Layout";
import Tasks from "../components/Tasks";
import Users from "../components/Users";
import "./styles/admin_panel.css"

export default function AdminPanel(){
   const [activeTab, setActiveTab] = useState("tasks");

   const renderTab= ()=> {
      switch (activeTab){
      case "tasks":
         return <Tasks/>;

      case "users":
         return <Users/>;
      
      case "create":
         return <CreateAccount/>
         
      default:
         return <Tasks/>;
      }
   }

   return( <>
    
    <Layout children={undefined}></Layout>

    <div className="dashboard-container">

      <div className="tab-buttons">
         <button className={`tablink ${activeTab === "tasks" ? "active" : " "}`}
          onClick={()=>setActiveTab("tasks")}> 
            
            Uppdrag </button>
      </div>
      
       <div className="tab-buttons">
         <button className={`tablink ${activeTab === "users" ? "active" : " "}`}
          onClick={()=>setActiveTab("users")}> 
            Användare </button>
      </div>

       <div className="tab-buttons">
         <button className={`tablink ${activeTab === "create" ? "active" : " "}`}
          onClick={()=>setActiveTab("create")}> 
            Skapa konto </button>
      </div>
     
   <div className="tabcontent">{renderTab()}</div>
   
    </div>
    </>
   )
}