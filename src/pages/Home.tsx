import Layout from "../components/Layout";
import "./styles/home.css"


export default function Home(){

 

    return(
   <div className="dashboard-container">
    <Layout children={undefined}></Layout>
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

  <div className="task-container">
    <table className="table"> 

    <thead>
      <tr>
        <th> Title </th>
        <th> Status </th>
        <th> Deadline </th>
      </tr>
    </thead>
    <tbody id="tbody">
      <tr>
        <td className="text-center"> empty </td>
        <td className="text-center"> empty </td>
        <td className="text-center"> empty </td>
      </tr>
    </tbody>
  </table>
  </div>

</div>


)
}