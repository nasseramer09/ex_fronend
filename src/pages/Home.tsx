import "./styles/home.css"
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

   const data = [ 
        {name: "Mån", uppdrag: 223},
        {name: "Tis", uppdrag: 12},
        {name: "Ons", uppdrag: 2},
        {name: "Tors", uppdrag:20},
        {name: "Fre", uppdrag: 90},
        {name: "Lör", uppdrag: 55},
        {name: "Sön", uppdrag: 2},
    ];

export default function Home(){

 

    return(
   <div className="dashboard-container">
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
      </tr>
    </tbody>
  </table>
  </div>

  <div className="chart-wraper">

        <h2> Uppdrag per vecka </h2>

        <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey= "name"/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uppdrag" fill="#3498db" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
  </div>
</div>


)
}