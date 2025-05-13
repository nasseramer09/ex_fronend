import Layout from "../components/Layout";
import "./styles/dashboard.css"
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

   const data = [ 
        {name: "Mån", uppdrag: 3},
        {name: "Tis", uppdrag: 2},
        {name: "Ons", uppdrag: 2},
        {name: "Tors", uppdrag:2},
        {name: "Fre", uppdrag: 8},
        {name: "Lör", uppdrag: 5},
        {name: "Sön", uppdrag: 2},
    ];

export default function Dashboard(){

 

    return(
        <>
        <Layout children={undefined}></Layout>
   <div className="dashboard-container">
    
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

 </>
)
}