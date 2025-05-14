import CreateAccount from "../components/CreateAccount";
import Layout from "../components/Layout";
import Tasks from "../components/Tasks";
import Users from "../components/Users";
import "./styles/admin_panel.css"

export default function AdminPanel(){
   

   return( <>
    
    <Layout children={undefined}></Layout>
    <Tasks/>

    <Users/>
    <CreateAccount/>
    
      <div className="row">

        <div className="card">
            <h4> Totalt uppdrag </h4>
            <p id="totalUppdrag"> empty </p>
        </div>

        <div className="card">
            <h4> Activa uppdrag </h4>
            <p id="activaUppdrag"> empty </p>
        </div>

        <div className="card">
        <h4> Lediga Bilar </h4>
        <p id="ledigaBilar"> empty </p>
        </div>

  </div>
            
       
    </>
   )
}